<script>
  import { Button } from 'flowbite-svelte';
  import { ChevronRightOutline } from 'flowbite-svelte-icons';

  let { text = [] } = $props();

  let expanded = $state(false);

  function expand() {
    expanded = true;
  }
</script>

{#each text as instruction, index (index)}
  <div class:collapsed={!expanded}>
    {#if index === 0 || expanded}
      <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-relaxed">
        {instruction}
      </p>
      {#if index === 0 && !expanded && text.length > 1}
        <Button
          onclick={expand}
          color="light" 
          size="xs"
          class="mt-2 inline-flex items-center"
        >
          <span class="mr-1">Show more instructions</span>
          <ChevronRightOutline class="w-3 h-3" />
        </Button>
      {/if}
    {/if}
  </div>
{/each}

<style>
  .collapsed p {
    overflow: hidden;
    max-height: 6rem;
    -webkit-box-orient: vertical;
    display: block;
    display: -webkit-box;
    overflow: hidden !important;
    text-overflow: ellipsis;
    -webkit-line-clamp: 4;
    margin-bottom: 0px;
  }
</style>