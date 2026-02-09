/* DATA STORE */
const LORE = {
    passcode: "2801", 
    
    // NEW: Streaming Vault
    vault: [
        {
            type: "stream", 
            title: "Aug_Sept_2024",
            items: [
                "https://drive.google.com/drive/folders/1vBAaR0Xz5b6w1oPJEb-vswDbKIC3hj5K"
            ]
        },
        {
            type: "stream",
            title: "December_2024",
            items: [
                "https://drive.google.com/drive/folders/1M8SbT4mltGE6wfyhsysmwJbLoemozg63"
            ]
        },
        {
            type: "stream",
            title: "June_July_2025",
            items: [
                "https://drive.google.com/drive/folders/1IgEE-QIV6rpNtwrDkJcdfStYsi2VKryz"
            ]
        },
        {
            type: "stream",
            title: "Dec_25_Jan_26",
            items: [
                "https://drive.google.com/drive/folders/1dHpd_JhN4Vhx4yJLVf0PUIF0Bv4xQsi0"
            ]
        }
    ],

    timeline: [
        { date: "JUL 2024", title: "Chapter 1", desc: "My first trip to Czechia." },
        { date: "DEC 2024", title: "Chapter 2", desc: "Winter Magic." }
    ],

    quiz: [
        { question: "Where was our first date?", options: ["Starbucks", "Pizza", "Park"], correct: 1 },
        { question: "Fav movie?", options: ["Shrek 2", "Frozen", "Dark Knight"], correct: 0 }
    ],

    letters: [
        { title: "Open when sad", icon: "🩹", content: "You are strong..." },
        { title: "Open when mad", icon: "😡", content: "I'm sorry..." }
    ],

    // MAP LOCATIONS WITH CLICKABLE PINS
    mapPoints: [
        // CAPE TOWN LOCATIONS (Green/Blue theme)
        { 
            title: "Simons Town", 
            lat: -34.1926, 
            lon: 18.4341,
            color: 0x00ff88,
            image: "assets/images/locations/simons-town.jpg",
            description: "A charming naval town with penguins and ocean views. Our adventure began here..."
        },
        { 
            title: "Kalk Bay", 
            lat: -34.1287, 
            lon: 18.4487,
            color: 0x00ff88,
            image: "assets/images/locations/kalk-bay.jpg",
            description: "Colorful fishing village with the best fish and chips. Remember the seals?"
        },
        { 
            title: "Glencairn", 
            lat: -34.1636, 
            lon: 18.4394,
            color: 0x00ff88,
            image: "assets/images/locations/glencairn.jpg",
            description: "Peaceful beach town with stunning mountain views."
        },
        { 
            title: "Boulders Beach", 
            lat: -34.1975, 
            lon: 18.4506,
            color: 0x00ff88,
            image: "assets/images/locations/boulders-beach.jpg",
            description: "Home to the famous African penguins! 🐧 Waddle waddle..."
        },
        { 
            title: "Two Oceans Aquarium", 
            lat: -33.9070, 
            lon: 18.4189,
            color: 0x0088ff,
            image: "assets/images/locations/aquarium.jpg",
            description: "Where two oceans meet. The jellyfish tank was mesmerizing! 🌊"
        },

        // CZECHIA LOCATIONS (Pink/Red theme)
        { 
            title: "Tarzánie, Trojanovice", 
            lat: 49.5031, 
            lon: 18.2564,
            color: 0xff4d6d,
            image: "assets/images/locations/tarzanie.jpg",
            description: "Adventure park in the mountains. Swinging through the trees like Tarzan! 🌲"
        },
        { 
            title: "Brno", 
            lat: 49.1951, 
            lon: 16.6068,
            color: 0xff4d6d,
            image: "assets/images/locations/brno.jpg",
            description: "Second largest city in Czechia. Beautiful architecture and cozy cafes ☕"
        },
        { 
            title: "Frenštát", 
            lat: 49.5490, 
            lon: 18.2110,
            color: 0xff4d6d,
            image: "assets/images/locations/frenstat.jpg",
            description: "Small town with big heart. The mountains here are breathtaking! ⛰️"
        },
        { 
            title: "Ostrava", 
            lat: 49.8209, 
            lon: 18.2625,
            color: 0xff4d6d,
            image: "assets/images/locations/ostrava.jpg",
            description: "Industrial city with a rich history. The Bolt Tower views were amazing! 🏭"
        },
        { 
            title: "Olomouc", 
            lat: 49.5938, 
            lon: 17.2509,
            color: 0xff4d6d,
            image: "assets/images/locations/olomouc.jpg",
            description: "Historic city with stunning churches and the famous astronomical clock ⏰"
        }
    ]
};