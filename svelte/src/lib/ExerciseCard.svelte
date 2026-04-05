<script>
  import { Card, Button, Badge } from 'flowbite-svelte';
  import { BookmarkOutline, BookmarkSolid } from 'flowbite-svelte-icons';
  import PhotoGallery from './PhotoGallery.svelte';
  import ExerciseInstructions from './ExerciseInstructions.svelte';

  // Props
  let { 
    exercise,
    isBookmarked = false,
    onBookmarkToggle = () => {} 
  } = $props();

  // Computed values
  let primaryMuscles = $derived(exercise.primaryMuscles || []);
  let equipment = $derived(exercise.equipment || '');
  let instructions = $derived(exercise.instructions || []);
  let images = $derived(exercise.images || []);
</script>

<Card class="max-w-none" padding="none">
  <div class="flex flex-col md:flex-row">
    <!-- Image Gallery -->
    <div class="md:w-64 flex-shrink-0">
      <PhotoGallery photos={images} />
    </div>
    
    <!-- Content -->
    <div class="flex-1 p-6 relative">
      <!-- Bookmark Button -->
      <Button
        color="light"
        size="xs"
        class="absolute top-4 right-4 p-2"
        onclick={onBookmarkToggle}
        aria-label={isBookmarked ? 'Remove from bookmarks' : 'Add to bookmarks'}
      >
        {#if !isBookmarked}
          <BookmarkOutline class="w-5 h-5 text-gray-400 hover:text-primary-600" />
        {:else}
          <BookmarkSolid class="w-5 h-5 text-primary-600" />
        {/if}
      </Button>
      
      <!-- Exercise Name -->
      <h3 class="mb-3 text-2xl font-bold tracking-tight text-gray-900 dark:text-white pr-12">
        {exercise.name}
      </h3>
      
      <!-- Primary Muscles -->
      {#if primaryMuscles.length > 0}
        <div class="mb-3 flex flex-wrap gap-2">
          {#each primaryMuscles as muscle}
            <Badge color="primary" class="text-xs">
              {muscle}
            </Badge>
          {/each}
        </div>
      {/if}
      
      <!-- Equipment -->
      {#if equipment}
        <div class="mb-3">
          <Badge color="gray" class="text-xs">
            {equipment}
          </Badge>
        </div>
      {/if}
      
      <!-- Exercise Level -->
      {#if exercise.level}
        <div class="mb-3">
          <Badge 
            color={exercise.level === 'beginner' ? 'green' : exercise.level === 'intermediate' ? 'yellow' : 'red'} 
            class="text-xs"
          >
            {exercise.level}
          </Badge>
        </div>
      {/if}
      
      <!-- Instructions -->
      <ExerciseInstructions text={instructions} />
    </div>
  </div>
</Card>