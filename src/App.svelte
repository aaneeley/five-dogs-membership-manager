<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import { onMount } from 'svelte';
	import './app.css';
	import * as Select from '$lib/components/ui/select/index.js';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import PresetDatePicker from '$lib/components/PresetDatePicker.svelte';
	import { writable } from 'svelte/store';

	let idInputFocused = false;
	let idInputValue;
	let idInputInstance;
	let magstripeInputInstance;
	let magstripeInputValue;
	let magstripeInputFocused = document.activeElement.id == 'magstripe-input';
	setInterval(() => {
		magstripeInputFocused = document.activeElement.id == 'magstripe-input';
	}, 200);

	// Function to handle keydown events
	const handleKeydown = (event) => {
		if (event.key === 'Escape') {
			clearView();
		}
		if (event.key === 'Enter' && currentState === FormState.Idle) {
			searchMember(true);
		}
	};

	function searchMember(checkIn = false) {
		window.electron.ipcRenderer.invoke('search-member', idInputValue).then((members) => {
			if (members.length === 1) {
				console.log(members[0]);
				currentState = checkIn ? FormState.CheckedIn : FormState.Found;
				first_name = members[0].first_name;
				last_name = members[0].last_name;
			} else if (members.length === 0) {
				console.log('no members with that ID');
			} else {
				console.log('too many members with that ID');
			}
		});

		// Fill in all the form stuff
	}

	function clearView() {
		//TODO: Make this clear out fields and stuff
		first_name = '';
		last_name = '';
		idInputValue = '';
		currentState = FormState.Idle;
		setTimeout(() => idInputInstance.focus(), 50);
	}

	function addMember() {
		idInputValue = 'FD0000001';
		currentState = FormState.Create;
		magstripeInputInstance.focus();
	}

	function testMagstripeInput() {
		// Test if regex is in input
		const regex = /%\w+\^[\w$]+\^[\d\w ]+\^\?/;
		if (regex.test(magstripeInputValue)) {
			console.log('INPUT VALID');
			magstripeInputValue = '';
		}
	}

	// Attach the event listener when the component is mounted
	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
		return () => window.removeEventListener('keydown', handleKeydown);
	});

	enum FormState {
		Idle,
		Found,
		CheckedIn,
		Create,
	}

	let currentState = FormState.Idle;

	$: autoScanReady =
		(idInputFocused &&
			currentState === FormState.Idle &&
			(!idInputValue || idInputValue.length === 0)) ||
		(magstripeInputFocused && currentState === FormState.Create);
	let membership_type;
	let first_name;
	let last_name;
	let membership_color = '';
	const update_membership_color = (v) => {
		console.log(v);
		if (!v) return;
		if (v.value === 'conditional') {
			membership_color = 'border-4 border-green-400 ';
		} else {
			membership_color = 'border-4 border-purple-400 ';
		}
	};

	/** 
 * Sample magstripe data:
 * 
	%AZGILBERT^NEELEY$ANDREW$CLARK^3676 E LATHAM CT^?
	;6360262069071312=290620050107=?
	%0085297    G   L      1075155BLNBLUT69071312?

	First line regex:
	%\w+\^[\w$]+\^[\d\w ]+\^\?
*/
</script>

<head></head>
<textarea
	id="magstripe-input"
	class="absolute top-0 right-20 z-[1] opacity-50"
	bind:this={magstripeInputInstance}
	bind:value={magstripeInputValue}
	on:keypress={testMagstripeInput}
/>
<main class="w-screen h-screen flex flex-col justify-start items-center">
	<div class="w-screen flex justify-start items-center border-b-2 space-x-4 p-4">
		<Button on:click={clearView}>
			Clear View <span class="opacity-50 ml-3 text-[9px]">ESC</span>
		</Button>
		<Button on:click={addMember}>Add Member</Button>
		{#if autoScanReady}
			<h1 class="font-bold text-green-500">Ready for Scan</h1>
		{:else}
			<h1 class="font-bold text-destructive">Not Ready for Scan</h1>
		{/if}
	</div>
	<div class="grid gap-20 p-10 grid-cols-2 w-screen max-w-[70rem]">
		<div class="w-full">
			<Input
				class="w-full text-center"
				placeholder="Membership ID"
				bind:value={idInputValue}
				bind:this={idInputInstance}
				on:focusin={() => (idInputFocused = true)}
				on:focusout={() => (idInputFocused = false)}
				disabled={currentState !== FormState.Idle}
			/>
			<hr class="my-5" />
			<div class="grid grid-cols-2 gap-3">
				<div>
					<Label for="first-name">First</Label>
					<Input
						class="w-full"
						placeholder="First Name"
						id="first-name"
						bind:value={first_name}
					/>
				</div>
				<div>
					<Label for="last-name">Last</Label>
					<Input
						class="w-full"
						placeholder="Last Name"
						id="last-name"
						bind:value={last_name}
					/>
				</div>
			</div>
			<Label for="email">Email</Label>
			<Input
				disabled={currentState === FormState.Idle}
				class="w-full"
				placeholder="Email"
				id="email"
			/>
			<Label for="phone">Phone</Label>
			<Input
				disabled={currentState === FormState.Idle}
				class="w-full"
				placeholder="Phone"
				id="phone"
			/>
			<hr class="my-5" />
			<Label for="address">Address</Label>
			<Input
				disabled={currentState === FormState.Idle}
				class="w-full"
				placeholder="Street Address"
				id="address"
			/>
			<Label for="city">City</Label>
			<Input
				disabled={currentState === FormState.Idle}
				class="w-full"
				placeholder="City"
				id="city"
			/>
			<div class="grid grid-cols-2 gap-3">
				<div>
					<Label for="state">State</Label>
					<Select.Root>
						<Select.Trigger disabled={currentState === FormState.Idle}>
							<Select.Value placeholder="State" />
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="az">Arizona</Select.Item>
							<Select.Item value="ca">California</Select.Item>
							<Select.Item value="tx">Texas</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div>
					<Label for="zip">Zip</Label>
					<Input
						class="w-full"
						placeholder="Zip"
						id="zip"
						disabled={currentState === FormState.Idle}
					/>
				</div>
			</div>
		</div>

		<div class="space-y-3 w-full flex flex-col items-center">
			<div
				class="border-solid border-2 w-[180px] h-[225px] bg-opacity-0 relative overflow-hidden"
			>
				<img class="absolute bottom-0" src="/picture-placeholder.png" alt="" />
			</div>
			<div class="grid grid-cols-2 gap-3 w-full">
				<div>
					<Label for="membership-type">Membership Type</Label>
					<Select.Root
						onSelectedChange={update_membership_color}
						bind:selected={membership_type}
					>
						<Select.Trigger class="" disabled={currentState === FormState.Idle}>
							{#if membership_type?.value === 'conditional'}
								<span class="ml-2 bg-green-300 py-1 px-2 rounded-lg">
									Conditional
								</span>
							{:else if membership_type?.value === 'general'}
								<span class="ml-2 bg-purple-400 py-1 px-2 rounded-lg">General</span>
							{:else}
								<span class="opacity-50">Membership Type</span>
							{/if}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value="conditional">
								<span class="bg-green-300 py-1 px-2 rounded-lg">Conditional</span>
							</Select.Item>
							<Select.Item value="general">
								<span class="bg-purple-400 py-1 px-2 rounded-lg">General</span>
							</Select.Item>
						</Select.Content>
					</Select.Root>
				</div>
				<div>
					<Label for="expiration-date">Expiration Date</Label>
					<PresetDatePicker disabled={currentState === FormState.Idle} />
				</div>
			</div>
			<div class="grid grid-cols-2 gap-3 w-full">
				<div>
					<Label for="created-date">Created Date</Label>
					<Input
						class="w-full"
						placeholder="Created Date"
						id="created-date"
						disabled={true}
					/>
				</div>
				<div></div>
			</div>
			<div class="w-full">
				<Label for="notes">Notes</Label>

				<Textarea
					class="w-full resize-none h-20"
					placeholder="Notes"
					id="notes"
					disabled={currentState === FormState.Idle}
				/>
			</div>
		</div>
	</div>
</main>
<div class="absolute bottom-0 w-screen flex flex-row justify-end bg-white border-t-2 p-4 space-x-4">
	{#if currentState === FormState.Idle}
		<Button variant="outline" on:click={() => searchMember()}>Search</Button>
	{/if}
	{#if currentState === FormState.Idle || currentState === FormState.Found}
		<Button
			disabled={idInputValue?.length == 0 || !idInputValue}
			on:click={() => searchMember(true)}
		>
			Check-In <span class="opacity-50 ml-3">⏎</span>
		</Button>
	{/if}
	{#if currentState === FormState.Create}
		<Button on:click={() => {}}>
			Create <span class="opacity-50 ml-3">⏎</span>
		</Button>
	{/if}
</div>
