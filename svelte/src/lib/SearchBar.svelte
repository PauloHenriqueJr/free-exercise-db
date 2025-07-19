<script>
  import { onMount } from 'svelte';
  import { Search, Button, Card, Spinner } from 'flowbite-svelte';
  import { BookmarkOutline, BookmarkSolid } from 'flowbite-svelte-icons';
  import Fuse from 'fuse.js';
  import ExerciseInstructions from './ExerciseInstructions.svelte';
  import PhotoGallery from './PhotoGallery.svelte';

  let query = $state('');
  let exercises = $state([]);
  let searchResults = $state([]);
  let pageSize = $state(50);
  let currentPage = $state(0);
  let savedExercises = $state([]);
  let showSavedExercises = $state(false);
  let loading = $state(true);

  let paginatedItems = $derived(searchResults.slice(0, (currentPage + 1) * pageSize));

  function totalPages() {
    return Math.ceil(searchResults.length / pageSize);
  }

  function saveExercise(exercise) {
    if (!isBookmarked(exercise)) {
      savedExercises = [...savedExercises, exercise];
    } else {
      savedExercises = savedExercises.filter((e) => e !== exercise);

      if (savedExercises.length === 0) {
        query = '';
        searchResults = exercises;
        showSavedExercises = false;
      } else {
        searchResults = savedExercises;
      }
    }
  }

  function toggleSavedExercises() {
    if (searchResults === savedExercises) {
      searchResults = exercises;
      showSavedExercises = false;
    } else if (savedExercises.length > 0) {
      searchResults = savedExercises;
      showSavedExercises = true;
    }
  }

  function isBookmarked(exercise) {
    return savedExercises.includes(exercise);
  }

  function handleScroll() {
    if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
      if (totalPages() >= currentPage + 1) {
        setTimeout(() => {
          currentPage = currentPage + 1;
        }, 400);
      }
    }
  }

  $effect(() => {
    const options = {
      keys: ['id', 'name']
    };

    currentPage = 0;
    showSavedExercises = false;

    if (query.length > 1) {
      const fuse = new Fuse(exercises, options);
      searchResults = fuse.search({ name: query }).map((r) => r.item);
    } else {
      searchResults = exercises;
    }
  });

  $effect(() => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('savedExercises', JSON.stringify(savedExercises));
    }
  });

  onMount(async () => {
    try {
      const response = await fetch('https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json');
      exercises = await response.json();
      searchResults = exercises;
      loading = false;
    } catch (error) {
      console.error('Failed to load exercises:', error);
      loading = false;
    }

    if (typeof localStorage !== 'undefined' && localStorage.getItem('savedExercises')) {
      savedExercises = JSON.parse(localStorage.getItem('savedExercises'));
    }

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });
</script>

<div class="flex gap-2">
  <div class="flex-1">
    <Search 
      bind:value={query}
      placeholder="Search Exercises, Instructions"
      size="lg"
      class="focus:ring-primary-500 focus:border-primary-500"
    />
  </div>
  <div class="relative">
    <Button 
      color={showSavedExercises ? 'primary' : 'alternative'}
      size="lg"
      onclick={toggleSavedExercises}
      class="relative"
    >
      {#if savedExercises.length === 0}
        <BookmarkOutline class="w-5 h-5 mr-2" />
      {:else}
        <BookmarkSolid class="w-5 h-5 mr-2" />
      {/if}
      Saved
      {#if savedExercises.length > 0}
        <span class="absolute -top-2 -right-2 inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full dark:border-gray-900">
          {savedExercises.length}
        </span>
      {/if}
    </Button>
  </div>
</div>

{#if loading}
  <div class="flex justify-center items-center mt-8 py-12">
    <Spinner size="8" color="primary" />
    <span class="ml-3 text-lg text-gray-600 dark:text-gray-400">Loading exercises...</span>
  </div>
{:else}
  <div class="grid gap-4 mt-6">
    {#each paginatedItems as exercise (exercise.name)}
      <Card class="max-w-none" padding="none">
        <div class="flex flex-col md:flex-row">
          <div class="md:w-64 flex-shrink-0">
            <PhotoGallery photos={exercise.images} />
          </div>
          <div class="flex-1 p-6 relative">
            <Button
              color="light"
              size="xs"
              class="absolute top-4 right-4 p-2"
              onclick={() => saveExercise(exercise)}
            >
              {#if !isBookmarked(exercise)}
                <BookmarkOutline class="w-5 h-5 text-gray-400 hover:text-primary-600" />
              {:else}
                <BookmarkSolid class="w-5 h-5 text-primary-600" />
              {/if}
            </Button>
            
            <h3 class="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white pr-12">
              {exercise.name}
            </h3>
            
            {#if exercise.primaryMuscles?.length}
              <div class="mb-3 flex flex-wrap gap-2">
                {#each exercise.primaryMuscles as muscle}
                  <span class="px-2 py-1 text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 rounded-lg">
                    {muscle}
                  </span>
                {/each}
              </div>
            {/if}
            
            {#if exercise.equipment}
              <div class="mb-3">
                <span class="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-lg">
                  {exercise.equipment}
                </span>
              </div>
            {/if}
            
            <ExerciseInstructions text={exercise.instructions} />
          </div>
        </div>
      </Card>
    {/each}
  </div>
{/if}