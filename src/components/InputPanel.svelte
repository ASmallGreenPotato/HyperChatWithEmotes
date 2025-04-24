<script lang="ts">
    import ChatInput from "./ChatInput.svelte";

    export let ytInputParent: HTMLElement;
    export let ytInputPanel: HTMLElement;
    let ytInputDiv: HTMLElement;
    let inputPanel: HTMLDivElement;
    export function activate(){
        ytInputDiv = ytInputParent.querySelector("#input #input");
        ytInputPanel.style.setProperty("display", "none", "important");
        inputPanel.style.setProperty("display", "block", "important");
        console.log(ytInputParent);
        console.log(ytInputPanel);     
    }

    function deactivate(){
        ytInputPanel.style.setProperty("display", "block", "important");
        inputPanel.style.setProperty("display", "none", "important");
    }
</script>
<div bind:this={inputPanel} id="input-holder-panel">
    <ChatInput
    originalInput = {ytInputDiv}
    />
    <button on:click={deactivate}>deactivate</button>
</div>

<style>
    #input-holder-panel {
        height: 6rem;
    }
</style>