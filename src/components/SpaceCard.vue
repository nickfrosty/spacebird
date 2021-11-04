<template>
    
    <div v-if="space" class="flex justify-between space-x-4">

        <div class="w-full p-5 bg-white border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-800">
            <section class="space-y-1">
                
                <div class="flex items-start justify-between font-semibold">
                    <h2 class="text-3xl "><a target="_blank" v-bind:href="'https://twitter.com/i/spaces/'+space.id+'/peek'" class="hover:underline hover:text-red-500">{{ space.title ? ( space.title.length > 60 ? `${space.title.substring(0, 60)}...` : space.title  ) : `unknown title` }} </a></h2>

                    <div class="space-x-2 text-sm text-gray-900 ">
                    <span v-if="(Date.parse(space.created_at) > +new Date() - 24*60*60*1000) && space.state == 'live'" class="px-4 py-1 bg-green-200 rounded-full dark:bg-green-500">live</span>
                    <span v-if="space.state == 'scheduled'" class="px-4 py-1 text-sm text-gray-500 bg-gray-200 rounded-full">scheduled</span>
                    <span v-if="space.pinned" class="px-2 rounded-full hover:text-yellow-400 "><i class="fas fa-thumbtack"></i></span>
                    </div>
                </div>

                <div class="mx-4 space-x-5 text-gray-500 dark:text-gray-400">
                    <!-- <span class=""><i class="mr-2 fas fa-history"></i> starts in 1 day, 3 mins</span> -->
                    <span class="" v-if=" Date.parse(space.created_at) <= new Date()"><i class="mr-2 fas fa-hourglass-half"></i>{{ timeSince(Date.parse(space.created_at)) }} </span>
                    <span class="" v-if=" Date.parse(space.created_at) > new Date()"><i class="mr-2 fas fa-calendar-alt"></i>{{ timeSince(Date.parse(space.scheduled_start)) }} </span>
                    <span class=""><i class="mr-2 fas fa-microphone"></i>{{  space.host_ids.length + ( space.speaker_ids ? space.speaker_ids.length : 0 ) }} speakers</span>
                    <span class=""><i class="mr-2 fas fa-headphones"></i>{{ space.participant_count }} listeners</span>
                </div>
            
            </section>

            <div class="my-3 border-b border-gray-200 dark:border-gray-600"></div>

            <div class="mt-2 space-x-1 space-y-2">
                <p class="" v-if="space.description">
                    {{ space.description }}
                </p>

                <div class="flex flex-wrap" v-if="space.tags">
                    <span v-for="tag in space.tags" :key="tag" class="keyword"><i class="fas fa-hashtag"></i>{{ tag }}</span>
                </div>
            </div>

            <div class="flex justify-between mt-8">
                
                <div>
                    <div v-if="users.length > 0" class="flex items-center space-x-2">
                        
                        <a v-for="user in users.slice(0, 8)" :key="user.id" v-bind:href="'https://twitter.com/'+user.username" target="_blank" class="relative" v-bind:data-tooltip="'@'+user.username">
                            <img v-bind:src="user.profile_image_url" alt="" class="avatar">
                            <!-- <div class="absolute bottom-0 flex justify-between w-full">
                                <i class="left-0 w-1/2 text-yellow-300 fas fa-crown drop-shadow"></i>
                                <i class="right-0 w-1/2 text-blue-400 fas fa-certificate"></i>
                            </div> -->
                        </a>

                        <!-- <a href="#" class="" data-tooltip="Speaker: @username"><img src="https://pbs.twimg.com/profile_images/1452775866174361601/L962KaY2_normal.jpg" alt="" class="avatar"></a>
                        <a href="#" class="" data-tooltip="Speaker: @username"><img src="https://pbs.twimg.com/profile_images/1442164038218043395/ELu2sLN4_normal.jpg" alt="" class="avatar"></a>
                        <a href="#" class="" data-tooltip="Speaker: @username"><img src="https://pbs.twimg.com/profile_images/1451467149545861121/f8svCNMf_normal.jpg" alt="" class="avatar "></a>
                        <a href="#" class="" data-tooltip="Speaker: @username"><img src="https://pbs.twimg.com/profile_images/1453068186233016327/_u8duANY_normal.jpg" alt="" class="avatar"></a> -->
                        <!-- <a href="#" class="flex self-center font-semibold bg-gray-100 border-gray-400 avatar" data-tooltip="+23 listeners"><div class="text-lg text-center place-self-stretch"><i class="m-0 text-sm fa fas fa-plus"></i>23</div></a> -->
                    </div>
                </div>

                <div class="flex space-x-2 text-lg">
                    <button @click="copyToClipboard('https://twitter.com/i/spaces/'+space.id+'/peek')" class="meta-button" data-tooltip="Copy link to this space"><i class="fas fa-copy"></i></button>
                    <!-- <button class="meta-button" data-tooltip="Share this Space"><i class="fas fa-share-alt"></i></button> -->
                </div>
            
            </div>

        </div>
        
        <div class="space-y-2 text-xl text-center">
            <!-- <div class="w-full px-4 py-5 space-y-2 bg-white border border-gray-300 rounded-lg cursor-pointer dark:text-gray-400 dark:border-gray-600 dark:hover:border-green-700 dark:bg-gray-800 hover:text-green-600 dark:hover:text-green-500">
                <i class="block mx-auto fas fa-chevron-up"></i>
                <span class="block mx-auto font-semibold ">{{ space.up_votes }}</span>
            </div> -->
            <div class="w-full px-4 py-5 space-y-2 bg-white border border-gray-300 rounded-lg">
                <span class="block mx-auto font-semibold">{{ parseInt(space.participant_count) + space.host_ids.length + (space.speaker_ids ? space.speaker_ids.length : 0)  }}</span>
                <i class="block mx-auto text-gray-500 fa fas fa-users"></i>
            </div>
            
        </div>
    
    </div>
        
</template>

<script>

import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en.json'
TimeAgo.addLocale(en)
TimeAgo.setDefaultLocale(en); 


export default {
    name: 'SpaceCard',
    data() {
        return {
            users: [],
        }
    },
    props: {
        id: String,
        space: Object,
    },
    mounted( ) {
        // retreive the listing of the users associated with this space
        // every time the space card mounts
        this.users = this.$store.getters.getUsersForSpace(this.space);
    },
    methods:{
        // converts a timstamp into the 'timeago' format
        timeSince( timestamp ){
            const timeAgo = new TimeAgo('en-US')
            return timeAgo.format( timestamp )
        },
        copyToClipboard( target ){
            // older browser support
            var box = document.createElement("textarea");
            box.value = target;
            box.style.top = "0";
            box.style.left = "0";
            box.style.position = "fixed";
            document.body.appendChild(box);
            box.focus(); box.select(); box.setSelectionRange(0, box.value.length); 
            document.execCommand("copy");
            box.parentNode.removeChild(box);
            // newer browser support 
            return window.navigator.clipboard.writeText(target)
        }
    }
}
</script>

<style lang="postcss" scoped>

    .avatar{
        @apply bg-white rounded-full w-12 h-12 border border-gray-100 dark:border-gray-700 hover:shadow hover:border-gray-500 dark:hover:border-gray-300 text-center;
    }

    .meta-button{
        @apply p-2 w-12 h-12 text-center rounded-lg dark:hover:bg-red-600 hover:bg-red-500 hover:text-white;
    }

    .keyword{
        @apply mb-1 whitespace-nowrap px-3 py-1 font-semibold text-gray-500 hover:bg-red-500 rounded-lg cursor-pointer hover:text-white;
    }

</style>