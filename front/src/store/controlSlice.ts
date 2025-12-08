import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {masterPlayerSlice} from "./masterPlayerSlice.ts";
import {
    type ControlConnectionStatusMessage,
    ControlService,
    IControlMessageType,
    type MasterPlayerControlMessage
} from "../services/ControlService.ts";
import {SnapStream} from "../snapstream.ts";
import {ConnectionStatus} from "../services/SnapcastService.ts";
import AsyncLock from "async-lock"

const name = "control"

const initialState = {
    url: "ws://127.0.0.1:8080" as string,
    connected: false as boolean,
}

export const controlSlice = createSlice({
    name: name,
    initialState: initialState,
    reducers: {
        connect: (state, action: PayloadAction<string>) => {
            state.url = action.payload;
        },
        connected: (state) => {
            state.connected = true;
        },
        disconnected: (state) => {
            state.connected = false;
        }
    }
})

export const createControlMiddleware = () => {
    const service: ControlService = new ControlService(SnapStream.getClientId());
    const lock = new AsyncLock();

    return (store) => {
        service.on(IControlMessageType.CONNECTION_STATUS, (notification) => {
            const data = notification as ControlConnectionStatusMessage;
            if (data.message.payload.status == ConnectionStatus.CONNECTED) {
                store.dispatch(controlSlice.actions.connected());
            } else {
                store.dispatch(controlSlice.actions.disconnected());
            }
        })
        service.on(IControlMessageType.MASTER_PLAYER, (notification) => {
            const data = notification as MasterPlayerControlMessage;
            store.dispatch({
                type: masterPlayerSlice.actions.setMasterState.type,
                payload: {
                    state: {
                        volume: data.message.payload.volume,
                        muted: data.message.payload.muted,
                    },
                    remote: true
                }
            })
        })
        return (next) => (action) => {
            if (action.type === controlSlice.actions.connect.type) {
                lock.acquire(controlSlice.actions.connect.type, async () => {
                    service.disconnectSafe();
                    const url = action.payload;
                    if (!URL.canParse(url)) {
                        return;
                    }
                    if (!url.startsWith("ws") && !url.startsWith("wss")) {
                        return;
                    }
                    if (service.connected || service.connecting) {
                        service.disconnectSafe();
                    }
                    service.connect(url);
                });
            }

            if (masterPlayerSlice.actions.setMasterVolume.match(action) ||
                masterPlayerSlice.actions.setMasterMuted.match(action) ||
                masterPlayerSlice.actions.setMasterState.match(action)) {
                const result = next(action);
                if (service.connected && !action.payload.remote) {
                    service.notifyMasterPlayerChanged(store.getState().masterPlayer.volume, store.getState().masterPlayer.muted)
                }
                return result;
            }

            return next(action);
        }
    }
}