<template>

    <div class="" v-if="$store.state.searched == true && $store.state.loading == false && $store.state.spaces.length <= 0">
        <h3 class="text-lg font-semibold text-center">No Spaces were found...</h3>
    </div>

    <pagination :currentPage="currentPage" :pages="totalPages" @page-changed="paginate" />

    <section class="mt-5 space-y-4" v-for="space in $store.state.spaces.slice( start, start+perPage)" :key="space.id">

        <space-card :space="space" />
    
    </section>

    <pagination :currentPage="currentPage" :pages="totalPages" @page-changed="paginate" />

    
</template>


<script>

import SpaceCard from './SpaceCard.vue'
import Pagination from './Pagination.vue';

export default {
    name: 'SpaceListing',
    components: {
        SpaceCard,
        Pagination,
    },
    data() {
        return {
            perPage: 10,
            totalResults: 0,
            totalPages: 0,
            currentPage: 1,
            start: 0,
        }
    },
    beforeMount(){
        this.updateMeta();
    },
    beforeUpdate() {
        // console.log('beforeUpdate: space listing');
        this.updateMeta();
    },
    methods:{
        // update the meta data for the pagination and sorting
        updateMeta(){
            this.totalResults = this.$store.state.spaces.length;
            // console.log('total results: ' + this.totalResults);
            this.totalPages = Math.ceil(this.totalResults / this.perPage);
            // console.log('total pages: ' + this.totalResults);
        },
        
        // paginate the results being display on the page
        paginate( page ){
            // console.log('paginate: ' + page);
            this.start = page * this.perPage - this.perPage;
            this.currentPage = page;
        },
        
        // sort the spaces using the user defined settings
        sort(){
            
        },
    },
}
</script>