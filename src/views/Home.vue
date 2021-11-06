<template>
  
  <h1 class="text-4xl font-semibold text-center">Search and Explore<br class="md:hidden" /> Twitter Spaces</h1>

  <!-- <div class="flex flex-wrap" v-if="tags">
      <span @click="keywordClick(tag)" v-for="tag in tags" :key="tag" class="keyword"><i class="fas fa-hashtag"></i>{{ tag }}</span>
  </div> -->

  <search-form />
  
  <space-card-loader v-if="$store.state.loading" />
  <!-- <space-card-loader v-if="$store.state.loading" /> -->

  <space-listing />

</template>

<script>

  // @ is an alias to /src
  import SearchForm from '@/components/SearchForm.vue';
  import SpaceListing from '@/components/SpaceListing.vue';

  import SpaceCardLoader from '@/components/SpaceCardLoader.vue';

  export default {
    name: 'Home',
    components: {
      SpaceListing,
      SearchForm,
      SpaceCardLoader,
    },
    computed: {
      // ...mapState(['spaces', 'users']),
      // ...mapGetters([]),
    },
    methods: {
      keywordClick( tag ){
        console.log(tag);
        this.$store.state.searchText = tag;
        this.$store.dispatch('searchSpaces', {text:tag});
      }
    },
    beforeUpdate() {
      // console.log('beforeUpdate: home');
    },
    data(){
      return {
        tags: [
          'crypto',
          'mining',
          'nft',
          'SaaS',
          'business',
          'indiehackers',
        ]
      }
    },
    mounted() {

      // create the default searchQuery 
      //  load the most popular spaces onto the home page when it is mounted (aka loaded)
      const searchQuery = {
        method: 'top',
        // text: 'nft',
        // per_page: 10,
      };

      // async call for the 'searchSpaces' action using the searchQuery
      this.$store.dispatch('searchSpaces', searchQuery);
      
    },
  };
</script>


<style scoped lang="postcss">

  .keyword{
    @apply mb-1 whitespace-nowrap px-3 py-1 font-semibold text-gray-500 hover:bg-red-500 rounded-lg cursor-pointer hover:text-white;
  }

</style>