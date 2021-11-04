<template>
    
    <div class="flex justify-between space-x-4 transition-all duration-150 ease-in transform ">
        <div class="w-full p-5 bg-white border border-gray-300 rounded-lg">
            <section class="space-y-1">
                
                <div class="h-12 font-semibold bg-gray-300 rounded animate-pulse w-132"></div>

                <div class="h-6 bg-gray-200 rounded animate-pulse w-80"></div>
            
            </section>

            <div class="my-3 border-b border-gray-200 dark:border-gray-600"></div>

            <div class="flex justify-between mt-8">
                
                <div>
                    <div class="flex items-center space-x-2 animate-pulse">
                        
                        <div class="relative bg-gray-200 avatar"></div>
                        <div class="relative bg-gray-300 avatar"></div>
                        <div class="relative bg-gray-300 avatar"></div>
                        <div class="relative bg-gray-200 avatar"></div>

                    </div>
                </div>

                <div class="flex space-x-2 text-lg animate-pulse">
                    <span class="meta-button" ><i class="fas fa-copy"></i></span>
                    <span class="meta-button"><i class="fas fa-share-alt"></i></span>
                </div>
            
            </div>

        </div>
    
    </div>
        
</template>

<script>

export default {
    name: 'SpaceCardLoader',
     props: {
        items: {
            type: Number,
            default: 2
        },
        users: {
            type: Number,
            default: 4
        }
    },
    mounted( ) {
        // retreive the listing of the users associated with this space
        // every time the space card mounts
    },
}
</script>

<style lang="postcss" scoped>

    .avatar{
        @apply bg-white rounded-full w-12 h-12 border border-gray-100 text-center;
    }

    .meta-button{
        @apply p-2 w-12 h-12 text-center rounded-lg ;
    }

    .keyword{
        @apply mb-1 whitespace-nowrap px-3 py-1 font-semibold text-gray-500 hover:bg-red-500 rounded-lg cursor-pointer hover:text-white;
    }

</style>