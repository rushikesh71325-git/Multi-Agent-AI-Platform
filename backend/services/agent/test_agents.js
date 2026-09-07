import "dotenv/config";
import { graph } from "./graph/graph.js";

async function testAgent(name, input) {
    console.log(`\n==================== TESTING AGENT: ${name.toUpperCase()} ====================`);
    console.log("Input:", JSON.stringify(input));
    const startTime = Date.now();
    try {
        const result = await graph.invoke(input);
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`Status: SUCCESS (${elapsed}s)`);
        console.log("Returned Agent:", result.agent);
        console.log("Response Preview:", (result.aiResponse || "").slice(0, 200) + "...");
        if (result.images && result.images.length > 0) {
            console.log("Images Returned:", result.images.length, result.images);
        }
        if (result.artifact) {
            console.log("Artifact Returned:", {
                type: result.artifact.type,
                title: result.artifact.title,
                language: result.artifact.language,
                contentLength: result.artifact.content?.length || 0,
                downloadUrl: result.artifact.downloadUrl,
            });
        }
        return { success: true, agent: name, elapsed };
    } catch (err) {
        console.error(`Status: FAILED for ${name}:`, err.message);
        return { success: false, agent: name, error: err.message };
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function runAllTests() {
    const results = [];

    // 1. Test Chat Agent
    results.push(await testAgent("chat", {
        prompt: "Hello, introduce yourself briefly in one sentence.",
        agent: "chat",
        conversationId: "test-conv-chat",
    }));
    await sleep(2000);

    // 2. Test Search Agent
    results.push(await testAgent("search", {
        prompt: "What is the latest score or status of the ICC Champions Trophy or current cricket news?",
        agent: "search",
        conversationId: "test-conv-search",
    }));
    await sleep(2000);

    // 3. Test Coding Agent
    results.push(await testAgent("coding", {
        prompt: "Build a sleek digital clock with start/stop buttons in HTML, CSS and JS",
        agent: "coding",
        conversationId: "test-conv-coding",
    }));
    await sleep(2500);

    // 4. Test Image Generation Agent
    results.push(await testAgent("imageGen", {
        prompt: "A futuristic cyberpunk floating city at sunset with neon reflections",
        agent: "imageGen",
        conversationId: "test-conv-image",
    }));
    await sleep(2500);

    // 5. Test PPT Agent
    results.push(await testAgent("ppt", {
        prompt: "Create a 3 slide presentation on Introduction to Quantum Computing",
        agent: "ppt",
        conversationId: "test-conv-ppt",
    }));
    await sleep(2500);

    // 6. Test PDF Agent
    results.push(await testAgent("pdf", {
        prompt: "What is covered in this document?",
        agent: "pdf",
        conversationId: "test-conv-pdf",
    }));
    await sleep(2500);

    // 7. Test Auto Router
    results.push(await testAgent("auto (routing to coding)", {
        prompt: "Write a python script to calculate fibonacci sequence",
        agent: "auto",
        conversationId: "test-conv-auto",
    }));

    console.log("\n==================== TEST SUMMARY ====================");
    console.table(results);
    process.exit(0);
}

runAllTests().catch(err => {
    console.error("Test Suite Fatal Error:", err);
    process.exit(1);
});
