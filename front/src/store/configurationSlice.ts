import {createSlice, type PayloadAction} from "@reduxjs/toolkit";
import {LoggerFactory} from "../logger/LoggerFactory.ts";
import type {Logger} from "../logger/Logger.ts";

interface ConfigResponse {
    snapserver: SnapserverConfig;
    websocket: WebsocketConfig;
}

export interface SnapserverPorts {
    http: number,
    control: number,
    stream: number
}

export interface SnapserverConfig {
    ports: SnapserverPorts;
}

export interface WebsocketConfig {
    path: string
    port: number
}

export interface ConfigurationProps {
    host: string,
    port: number,
    websocket: WebsocketConfig,
    snapserver: SnapserverConfig,
}

const name: string = "configuration";
const initialState: ConfigurationProps = {
    host: window.location.hostname,
    port: Number(window.location.port),
    websocket: {
        path: "/ws",
        port: Number(window.location.port)
    },
    snapserver: {
        ports: {
            http: 1780,
            stream: 1704,
            control: 1705
        }
    }
}

export const configurationSlice = createSlice({
    name: name,
    initialState: initialState,
    reducers: {
        setHost: (state, action: PayloadAction<string>) => {
            state.host = action.payload as string;
        },
        setPort: (state, action: PayloadAction<number>) => {
            state.port = action.payload as number;
        },
        setWebsocketConfiguration: (state, action: PayloadAction<WebsocketConfig>) => {
            state.websocket = action.payload as WebsocketConfig;
        },
        setSnapserverConfiguration: (state, action: PayloadAction<SnapserverConfig>) => {
            state.snapserver = action.payload as SnapserverConfig;
        }
    }
})

export const createConfigurationMiddleware = () => {
    const logger: Logger = LoggerFactory.getLogger("configuration-middleware");

    return (store) => (next) => (action) => {

        const isHostOrPortAction =
            configurationSlice.actions.setHost.match(action) ||
            configurationSlice.actions.setPort.match(action);

        const result = next(action);

        if (isHostOrPortAction) {
            const state = store.getState().configuration;

            const scheme = "http://";
            const api = "/api/config";
            const url = `${scheme}${state.host}:${state.port}${api}`;

            logger.info(`Fetching configuration from ${url}`);

            fetch(url)
                .then(res => res.json())
                .then((json: ConfigResponse) => {
                    logger.info("Received config:", json);

                    store.dispatch(
                        configurationSlice.actions.setSnapserverConfiguration(json.snapserver)
                    );

                    store.dispatch(
                        configurationSlice.actions.setWebsocketConfiguration(json.websocket)
                    );
                })
                .catch(err => {
                    logger.error("Failed to fetch config:", err);
                });
        }
        return result;
    };
};
