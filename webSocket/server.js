const { Server } = require("socket.io");
const { io: ClientIO } = require("socket.io-client");
const { createServer } = require("http");
const { findIndex } = require("lodash");
const express = require('express');
const app = express();


let io

const httpServer = createServer();

try {
    io = new Server(httpServer, {
        cors: {
            origin: '*',
            methods: ["GET", "POST"],
            credentials: true,
        }});
} catch (error) {
    console.error("Error starting WebSocket server:", error.message);
    process.exit(1); // Exit process if port is in use
}

let userData = {}; // Stores latest data per user

if (io) {
    io.on("connection", (socket) => {
        const clientId = socket.id;
        console.log("Client ID:", clientId);
        console.log('socket connected ', socket.connected ? "true" : "false");
        io.to(clientId).emit("userData", userData);

        socket.emit("receiveSocketId", { socketId: socket.id });

        socket.on("testEvent", (data) => {
            console.log("testEvent", data);
            io.to(data.clientId).emit("progressData", [{
                videoName: "testVideo",
                path: "",
                completed: true
            }]);
        })

        socket.on("download", (data) => {
            console.log("Download data...", data);
            if (userData[data.uuid] && userData[data.uuid].length === 0) {
                console.log("Downloaded1");
                delete userData[data.uuid];
                io.to(data.clientId).emit("progressData", []);
            }

            if (userData[data.uuid]) {
                console.log("Downloaded2");
                const uuidCurrentDlProgressData = userData[data.uuid];
                const currDlIndex = findIndex(uuidCurrentDlProgressData, data.downloadUuid)

                if (currDlIndex === -1) {
                    userData[data.uuid] = [...uuidCurrentDlProgressData, { [data.downloadUuid]: data.progressData }]
                } else {
                    uuidCurrentDlProgressData[currDlIndex][data.downloadUuid] = data.progressData;
                    userData[data.uuid] = uuidCurrentDlProgressData
                }
                io.to(data.clientId).emit("progressData", userData[data.uuid]);
            } else {
                console.log("Downloaded3");
                userData[data.uuid] = [{ [data.downloadUuid]: data.progressData }]
                io.to(data.clientId).emit("progressData", userData[data.uuid]);
            }
        })

        socket.on("downloadComplete", (data) => {
            const modifiedData = userData[data.uuid] ? [...userData[data.uuid]] : [];
            const index = findIndex(modifiedData, data.downloadUuid)
            modifiedData[index][data.downloadUuid] = {
                videoName: modifiedData[index][data.downloadUuid].videoName,
                path: modifiedData[index][data.downloadUuid].path,
                completed: true
            }
            io.to(data.clientId).emit("progressData", modifiedData);
        })

        socket.on("cancelDownload", (data) => {
            const modifiedData = [...userData[data.uuid]];
            const index = findIndex(modifiedData, data.downloadUuid)
            modifiedData[index][data.downloadUuid] = {
                videoName: modifiedData[index][data.downloadUuid].videoName,
                path: modifiedData[index][data.downloadUuid].path,
                canceledDownload: true
            }
            io.to(data.clientId).emit("progressData", modifiedData);
        })

        // Handle disconnection
        socket.on("disconnectUser", (data) => {
            const clientId = data.clientId;
            const clientSocket = io.sockets.sockets.get(clientId); // Get the specific socket
            if (clientSocket) {
                clientSocket.disconnect(true); // Force disconnect
                console.log(`User ${clientId} disconnected`);
            }
            delete userData[data.uuid];
        });
        socket.on("error", (err) => {
            console.log("Caught flash policy server socket error: ")
            console.log(err)
        })
    });

    httpServer.listen(5001, "0.0.0.0", () => {
        console.log(`WebSocket server running on port 5001`);
    });

    app.use(express.json());

    const socket = ClientIO("http://0.0.0.0:5001", {
        reconnection: true
    });

// This endpoint will receive calls from your Next.js container
    app.post('/emit', async (req, res) => {
        // Expecting a payload like { eventName: 'your-event', data: { ... } }
        const { eventName, data } = req.body;
        // Wait for connection before emitting
        if (!socket.connected) {
            console.log("Received eventName2", eventName);
            socket.connect();
            socket.once("connect", () => {
                console.log("Connected to WebSocket server from Express");
                socket.emit(eventName, data);
            });
        } else {
            console.log("Received eventName2", eventName);
            socket.emit(eventName, data);
        }
        res.send({ data: 'ok'})
    });

    app.listen(5002, function (err) {
        if (err) console.log(err);
        console.log(`Server listening on PORT 5002`);
    });
}
