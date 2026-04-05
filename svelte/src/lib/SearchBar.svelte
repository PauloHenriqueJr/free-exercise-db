<script>
  import { onMount, onDestroy } from 'svelte';
  import { Search, Button, Card, Spinner, Alert } from 'flowbite-svelte';
  import { BookmarkOutline, BookmarkSolid, ExclamationCircleOutline } from 'flowbite-svelte-icons';
  
  import ExerciseInstructions from './ExerciseInstructions.svelte';
  import PhotoGallery from './PhotoGallery.svelte';
  import ExerciseCard from './ExerciseCard.svelte';
  
  import { 
    exerciseActions, 
    query, 
    loading, 
    error, 
    paginatedResults, 
    totalPages, 
    currentPage 
  } from './stores/exercises.js';
  import { bookmarks, bookmarkCount, isBookmarked } from './stores/bookmarks.js';
  import { createInfiniteScroll } from './utils/scroll.js';

  // Local state
  let showBookmarksOnly = $state(false);
  let searchInput = $state('');
  let displayResults = $state([]);

  // Scroll handler
  let scrollHandler;

  // Reactive assignments
  $effect(() => {
    if (showBookmarksOnly) {
      displayResults = $bookmarks;
    } else {
      displayResults = $paginatedResults;
    }
  });

  $effect(() => {
    exerciseActions.setQuery(searchInput);
  });

  // Functions
  function toggleBookmarksView() {
    showBookmarksOnly = !showBookmarksOnly;
    if (!showBookmarksOnly) {
      searchInput = '';
    }
  }

  function handleLoadMore() {
    if ($currentPage < $totalPages - 1) {
      exerciseActions.loadNextPage();
    }
  }

  function handleBookmarkToggle(exercise) {
    bookmarks.toggle(exercise);
    
    // If we're showing bookmarks only and this was the last one, switch back
    if (showBookmarksOnly && $bookmarkCount === 0) {
      showBookmarksOnly = false;
      searchInput = '';
    }
  }

  function retryFetch() {
    exerciseActions.fetchExercises();
  }

  // Lifecycle
  onMount(() => {
    exerciseActions.fetchExercises();
    scrollHandler = createInfiniteScroll(handleLoadMore);
    scrollHandler.attach();
  });

  onDestroy(() => {
    scrollHandler?.detach();
  });
</script>

<!-- Search Controls -->
<div class="flex gap-2">
  <div class="flex-1">
    <Search 
      bind:value={searchInput}
      placeholder="Search exercises by name or instructions..."
      size="lg"
      disabled={$loading || showBookmarksOnly}
    />
  </div>
  
  <div class="relative">
    <Button 
      color={showBookmarksOnly ? 'primary' : 'alternative'}
      size="lg"
      onclick={toggleBookmarksView}
      class="relative"
      disabled={$loading}
    >
      {#if $bookmarkCount === 0}
        <BookmarkOutline class="w-5 h-5 mr-2" />
      {:else}
        <BookmarkSolid class="w-5 h-5 mr-2" />
      {/if}
      Saved
      {#if $bookmarkCount > 0}
        <span class="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">
          {$bookmarkCount}
        </span>
      {/if}
    </Button>
  </div>
</div>

<!-- Content Area -->
{#if $error}
  <Alert color="red" class="mt-6">
    <ExclamationCircleOutline slot="icon" class="w-4 h-4" />
    <span class="font-medium">Error loading exercises:</span> {$error}
    <div class="mt-2">
      <Button color="red" size="xs" onclick={retryFetch}>
        Try Again
      </Button>
    </div>
  </Alert>
{:else if $loading}
  <div class="flex justify-center items-center mt-8 py-12">
    <Spinner size="8" color="primary" />
    <span class="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading exercises...</span>
  </div>
{:else}
  <div class="grid gap-4 mt-6">
    {#each displayResults as exercise (exercise.id)}
      <ExerciseCard 
        {exercise}
        isBookmarked={$isBookmarked(exercise)}
        onBookmarkToggle={() => handleBookmarkToggle(exercise)}
      />
    {/each}
    
    {#if displayResults.length === 0}
      <div class="text-center py-12">
        <p class="text-lg text-gray-500 dark:text-gray-400">
          {showBookmarksOnly ? 'No saved exercises yet.' : 'No exercises found.'}
        </p>
        {#if showBookmarksOnly}
          <Button color="primary" class="mt-4" onclick={toggleBookmarksView}>
            Browse All Exercises
          </Button>
        {/if}
      </div>
    {/if}
  </div>
{/if}