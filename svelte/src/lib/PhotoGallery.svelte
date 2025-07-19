<script>
  import { ArrowsRepeatOutline } from 'flowbite-svelte-icons';
  import { Button } from 'flowbite-svelte';

  let { photos = [] } = $props();

  let currentIndex = $state(0);
  let loading = $state(false);

  function nextPhoto(event) {
    event.preventDefault();
    loading = true;

    if (currentIndex === photos.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex++;
    }
  }

  function onImageLoad() {
    loading = false;
  }
</script>

<div class="relative group" class:loading>
  <button onclick={nextPhoto} class="block w-full h-full">
    <img
      src="https://ik.imagekit.io/yuhonas/{photos[currentIndex]}"
      srcset="https://ik.imagekit.io/yuhonas/{photos[currentIndex]} 850w, https://ik.imagekit.io/yuhonas/tr:w-250,h-180/{photos[currentIndex]} 200w"
      sizes="(min-width: 765px) 200px, 850px"
      loading="lazy"
      class="w-full h-48 md:h-full object-cover rounded-t-lg md:rounded-l-lg md:rounded-tr-none"
      onload={onImageLoad}
      alt="Exercise demonstration"
    />
  </button>
  <div class="absolute top-2 left-2 opacity-75 group-hover:opacity-100 transition-opacity">
    <Button size="xs" color="light" class="p-1">
      <ArrowsRepeatOutline class="w-4 h-4 text-gray-600 dark:text-gray-400" />
    </Button>
  </div>
  {#if photos.length > 1}
    <div class="absolute bottom-2 right-2 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
      {currentIndex + 1}/{photos.length}
    </div>
  {/if}
</div>

<style>
  .loading img {
    filter: blur(2px);
  }
</style>