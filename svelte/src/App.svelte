<script>
  import './app.css';
  import { Badge } from 'flowbite-svelte';
  import SearchBar from './lib/SearchBar.svelte';
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- GitHub Corner -->
  <a href="https://github.com/yuhonas/free-exercise-db" class="github-corner" aria-label="View source on GitHub">
    <svg width="80" height="80" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;" aria-hidden="true">
      <path d="m0,0 0,250 250,0 0,-250z"></path>
      <path d="m127.5,187.5 c-40,0 -72.5,-32.5 -72.5,-72.5 0,-32 20.8,-59.2 49.5,-68.7 3.6,-0.7 4.9,1.6 4.9,3.5 0,1.7 -0.1,6.2 -0.1,12.1 -20.2,-4.4 -24.5,9.7 -24.5,9.7 -3.3,8.4 -8,10.6 -8,10.6 -6.5,4.5 0.5,4.4 0.5,4.4 7.2,-0.5 11,-7.4 11,-7.4 6.4,-11 16.8,-7.8 20.9,-6 0.6,4.6 2.5,7.8 4.5,9.6 -15.9,1.8 -32.6,8 -32.6,35.3 0,7.8 2.8,14.2 7.4,19.2 -0.7,1.8 -3.2,9 0.7,18.8 0,0 6,1.9 19.7,-7.3 5.7,1.6 11.8,2.4 17.9,2.4 6.1,0 12.2,-0.8 17.9,-2.4 13.7,9.2 19.7,7.3 19.7,7.3 3.9,-9.8 1.4,-17 0.7,-18.8 4.6,-5 7.4,-11.4 7.4,-19.2 0,-27.4 -16.7,-33.5 -32.6,-35.3 2.6,-2.2 4.9,-6.6 4.9,-13.3 0,-9.6 -0.1,-17.3 -0.1,-19.6 0,-1.9 1.3,-4.2 4.9,-3.5 28.7,9.5 49.5,36.7 49.5,68.7 0,40 -32.5,72.5 -72.5,72.5z" style="fill: currentColor;"></path>
    </svg>
  </a>

  <!-- Main Content -->
  <main class="container mx-auto px-4 py-8">
    <!-- Header Section -->
    <section class="text-center mb-12">
      <div class="flex justify-center items-center gap-3 mb-4">
        <h1 class="text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          Free Exercise DB
        </h1>
        <Badge color="primary" large>800+ Exercises</Badge>
      </div>
      
      <p class="text-lg md:text-xl font-normal text-gray-500 dark:text-gray-400 max-w-4xl mx-auto mb-8 leading-relaxed">
        This is a frontend to a public domain open data set of over 800+ exercises and photos.
        See the <a href="https://github.com/yuhonas/free-exercise-db/" class="text-primary-600 dark:text-primary-400 hover:underline font-medium">repository</a>
        for more details including how to get the backend data. Enjoy! 💪
      </p>
      
      <!-- Search Section -->
      <div class="max-w-2xl mx-auto">
        <SearchBar />
      </div>
    </section>
  </main>
</div>

<style>
  :global(.github-corner:hover .octo-arm) {
    animation: octocat-wave 560ms ease-in-out;
  }
  
  @keyframes octocat-wave {
    0%, 100% { transform: rotate(0); }
    20%, 60% { transform: rotate(-25deg); }
    40%, 80% { transform: rotate(10deg); }
  }
  
  @media (max-width: 500px) {
    :global(.github-corner:hover .octo-arm) {
      animation: none;
    }
    :global(.github-corner .octo-arm) {
      animation: octocat-wave 560ms ease-in-out;
    }
  }

  :global(.dark) {
    color-scheme: dark;
  }
</style>