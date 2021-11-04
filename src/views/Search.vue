<template>
  
  <h1 class="text-4xl font-semibold text-center">Search and Explore Twitter Spaces</h1>

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
  name: 'Search',
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
    // ...mapMutations([])
  },
  beforeUpdate() {
    // console.log('beforeUpdate: search');
  },
  setup(){

  },
  mounted() {

    // create the default searchQuery 
    //  load the most popular spaces onto the home page when it is mounted (aka loaded)
    // const searchQuery = {
    //     text: 'nft',
    //     per_page: 10,
    // };

    // console.log('starting intial search');
    // async call for the 'searchSpaces' action using the searchQuery
    // this.$store.dispatch('searchSpaces', searchQuery);
    
  },
};
</script>


