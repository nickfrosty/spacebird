<template>

    <VueTailwindPagination  v-if="total > 0" @click="paginate" @page-changed="current = $event; " :current="currentPage" :total="total" :per-page="perPage" />

    <section class="mt-5 space-y-4" v-for="space in (this.$store.state.spaces).slice( start, start+perPage)" :key="space.id">

        <space-card :space="space" />
    
    </section>
    
</template>


<script>



// import 'ocrv/vue-tailwind-pagination/styles'
import VueTailwindPagination from '@ocrv/vue-tailwind-pagination'
import SpaceCard from './SpaceCard.vue'

export default {
    name: 'SpaceListing',
    components: {
        SpaceCard,
        VueTailwindPagination,
    },
    data() {
        return {
            currentSpaces: [],
            spaces: [],
            current: 1,
            currentPage: 1,
            perPage: 10,
            total: 0,
            start: 0,
        }
    },
    mounted(){
        this.total = this.$store.state.spaces.length;
    },
    beforeUpdate() {
        console.log('beforeUpdate: space listing');
        this.total = this.$store.state.spaces.length;
        console.log('total: ' + this.total);
    },
    methods:{
        paginate( ){
            console.log('init: ' + this.current);
            // this.total = spaces.length;

            // this.currentSpaces = spaces;

            console.log('old: ' + this.current);

            // if ( newPage )
            //     this.currentPage = this.newPage;
            // else if ( this.current !== undefined && this.current !== null )
            //     this.currentPage = this.current;
            
            console.log('new: ' + this.currentPage);

            // return ;
            this.currentPage = this.current;
            this.start = this.current * this.perPage;

            // this.currentSpaces = this.spaces.slice( this.start, this.start+this.perPage);
            
            console.log('done: ');
        },
        // sort the spaces using the user defined settings
        sort(){
            
        },
    },
}
</script>