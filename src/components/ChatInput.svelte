<script lang="ts">


    import { emoteMap } from '../ts/word-image-map';



    export let originalInput: HTMLElement;
    let editableDiv: HTMLDivElement;

    let iframe = window.top?.document.querySelector<HTMLIFrameElement>("iframe#chatframe");

    let text = "";

    let inTabMode = false;

    function autocompleteEmote(textLead: string){
        console.log(Object.keys(emoteMap).filter(key => key.startsWith(textLead)));
        return textLead;
    }

    function updateOriginalInputDiv(newText: string) {
        //Update original input div
        // Set content
        originalInput.textContent = newText;

        // Create and dispatch an input event
        const inputEvent = new Event("input", {
            bubbles: true,
            cancelable: true,
        });
        originalInput.dispatchEvent(inputEvent);
    }

    function handleInput(event: Event) {
        const target = event.target as HTMLElement;
        text = target.innerText.replace(/\u200B/g, "").trim();
        
        let label = editableDiv.parentElement?.querySelector<HTMLIFrameElement>("label");
        if (text != "") {
            console.log(text)
            if (label){
                label.style.display = "none";
            }            
        } else {
            console.log("nothing")
            if (label){
                label.style.display = "block";
            } 
        }
        
    }
    function handleKeydown(event: KeyboardEvent) {
        if (event.key === "Tab") {
            event.preventDefault();
            // autocomplete logic here
            autocompleteEmote(text);
            text = text + " okak";
            editableDiv.textContent = text;
            updateOriginalInputDiv(text);
            console.log("tab")
        }
        if (event.key === "Enter") {
            event.preventDefault();
            if(text != ""){
                console.log("enter", text);

                updateOriginalInputDiv(text);

                setTimeout(() =>
                {
                    iframe?.contentDocument.querySelector("#send-button > yt-button-renderer > yt-button-shape > button").click();
                    text = "";
                    editableDiv.textContent = text;
                    updateOriginalInputDiv(text);
                    
                    let label = editableDiv.parentElement?.querySelector<HTMLIFrameElement>("label");
                    if (text != "") {
                        if (label){
                            label.style.display = "none";
                        }            
                    } else {
                        if (label){
                            label.style.display = "block";
                        } 
                    }
                }, 50)
            }
        }
    }

</script>

<div bind:this={editableDiv} contenteditable="true" on:input={handleInput} on:keydown={handleKeydown} class="style-scope yt-live-chat-text-input-field-renderer" id="input">
    
</div>