<script>
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';
	import './app.css';

	let inputElement;

	// Function to handle keydown events
	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			inputElement?.focus();
		}
	};

	// Attach the event listener when the component is mounted
	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});
</script>

<head></head>
<main class="w-screen h-screen flex flex-col justify-start">
	<div class="w-screen flex justify-start items-center border-b-2 space-x-4 p-4">
		<Button>
			Clear View <span class="opacity-50 ml-3 text-[9px]">ESC</span>
		</Button>
		<Button>Add Member</Button>
	</div>
	<div class="grid gap-y-2 p-2">
		<input placeholder="Membership ID" bind:this={inputElement} />

		<input placeholder="First Name" />
	</div>
</main>
<div class="absolute bottom-0 w-screen flex flex-row justify-end bg-white border-t-2 p-4 space-x-4">
	<Button variant="outline">Search</Button>
	<Button>
		Quick Check-In <span class="opacity-50 ml-3">⏎</span>
	</Button>
</div>
