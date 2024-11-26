<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';
	import './app.css';

	let idInput;

	// Function to handle keydown events
	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			clearView();
		}
	};

	function clearView() {
		//TODO: Make this clear out fields and stuff
		idInput.value = '';
		idInput?.focus();
	}

	// Attach the event listener when the component is mounted
	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	let autoScanReady = document.activeElement == idInput;
	setInterval(() => {
		autoScanReady = document.activeElement == idInput && idInput.value.length === 0;
	}, 100);
</script>

<head></head>
<main class="w-screen h-screen flex flex-col justify-start">
	<div class="w-screen flex justify-start items-center border-b-2 space-x-4 p-4">
		<Button on:click={clearView}>
			Clear View <span class="opacity-50 ml-3 text-[9px]">ESC</span>
		</Button>
		<Button>Add Member</Button>
		{#if autoScanReady}
			<h1 class="font-bold text-green-500">Ready for Scan</h1>
		{:else}
			<h1 class="font-bold text-destructive">Not Ready for Scan</h1>
		{/if}
	</div>
	<div class="grid gap-y-2 p-6">
		<input placeholder="Membership ID" bind:this={idInput} />

		<input placeholder="First Name" />
		<input placeholder="Last Name" />
	</div>
</main>
<div class="absolute bottom-0 w-screen flex flex-row justify-end bg-white border-t-2 p-4 space-x-4">
	<Button variant="outline">Search</Button>
	<Button>
		Quick Check-In <span class="opacity-50 ml-3">⏎</span>
	</Button>
</div>
