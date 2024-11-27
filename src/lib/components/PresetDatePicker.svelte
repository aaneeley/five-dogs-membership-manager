<script lang="ts">
	import CalendarIcon from 'lucide-svelte/icons/calendar';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		today,
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Label from './ui/label/label.svelte';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long',
	});

	let value: DateValue | undefined = undefined;

	$: flagged = value && value < today(getLocalTimeZone());

	// Check if value is a year from today
	$: outlined =
		value &&
		value.year === today(getLocalTimeZone()).year + 1 &&
		value.month === today(getLocalTimeZone()).month &&
		value.day === today(getLocalTimeZone()).day;
</script>

<Popover.Root openFocus>
	<Popover.Trigger asChild let:builder>
		<Button
			variant="outline"
			class={cn(
				'w-full justify-start text-left font-normal',
				!value && 'text-muted-foreground',
				flagged && 'bg-red-300 border-red-600 border-2',
			)}
			builders={[builder]}
		>
			<CalendarIcon class="mr-2 h-4 w-4" />
			{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="flex w-auto flex-col space-y-2 p-2">
		<div>
			<Label for="date" class="mr-3">Jump To:</Label>
			<Button
				on:click={(v) => {
					if (!v) return;
					value = today(getLocalTimeZone()).add({ days: 365 });
				}}
				id="date"
				disabled={outlined}
			>
				Year from Today
			</Button>
		</div>
		<div class="rounded-md border">
			<Calendar bind:value />
		</div>
	</Popover.Content>
</Popover.Root>
