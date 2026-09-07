import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isOpen: false,
    artifact: null,
    activeTab: "preview", // 'preview' | 'code'
};

const artifactSlice = createSlice({
    name: "artifact",
    initialState,
    reducers: {
        setArtifact: (state, action) => {
            state.artifact = action.payload;
            state.isOpen = true;
            // Default to preview if it's web content, code if not
            if (action.payload?.type === "web" || action.payload?.type === "ppt") {
                state.activeTab = "preview";
            } else {
                state.activeTab = "code";
            }
        },
        openArtifact: (state) => {
            state.isOpen = true;
        },
        closeArtifact: (state) => {
            state.isOpen = false;
        },
        toggleArtifact: (state) => {
            state.isOpen = !state.isOpen;
        },
        setActiveTab: (state, action) => {
            state.activeTab = action.payload;
        },
        clearArtifact: (state) => {
            state.artifact = null;
            state.isOpen = false;
        },
    },
});

export const {
    setArtifact,
    openArtifact,
    closeArtifact,
    toggleArtifact,
    setActiveTab,
    clearArtifact,
} = artifactSlice.actions;

export default artifactSlice.reducer;
