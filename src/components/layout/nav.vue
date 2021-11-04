<template>

    <!-- Header navigation area -->
    <nav class="px-4 py-4 bg-gray-900">
        <div class="container md:flex md:items-center md:justify-between">
            <div class="flex items-center justify-between w-full">

            <router-link to="/" class="flex py-2 text-2xl font-bold text-white sm:text-3xl ">
                <img alt="logo" src="@/assets/logo.png" class="w-12 h-12 mr-3">
                Spacebird.io
            </router-link>

            <div class="hidden space-x-6 text-xl font-bold text-white md:block">
                <!-- <?php
                    $state_active = 'text-gray-100';
                    $state_inactive = 'text-gray-500 hover:text-gray-100';
                ?> -->
                <!-- <router-link to="/" class="inline-block py-1 md:py-4">Home</router-link>
                <router-link to="/about" class="inline-block py-1 md:py-4">About</router-link> -->
                <!-- <a href="/" class="inline-block py-1 md:py-4">Get Started</a> -->
                <!-- <?php echo request_dir('public_html') && request_file('index') ? $state_active : $state_inactive; ?> -->
            </div>
        
            <!-- <div class="flex items-center content-center justify-between ml-1 space-x-2 text-white md:justify-end">
                <a href="/login" class="text-white bg-blue-500 btn"><i class="fa fab fa-twitter"></i> Sign In</a>
            </div> -->
        
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Nav'
}
</script>

<style scoped>

</style>