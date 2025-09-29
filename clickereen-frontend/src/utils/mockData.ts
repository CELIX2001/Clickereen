// Mock data generator for endless feed
export interface MockUser {
  _id: string
  username: string
  displayName: string
  avatar: string
  verified: boolean
  followersCount: number
  followingCount: number
}

export interface MockPost {
  _id: string
  author: MockUser
  content: string
  media: Array<{
    type: 'image' | 'video' | 'audio' | 'gif'
    url: string
    thumbnail?: string
    duration?: number
  }>
  engagement: {
    totalLikes: number
    totalComments: number
    totalRetweets: number
    totalViews: number
  }
  hashtags: string[]
  mentions: string[]
  createdAt: string
  isLiked: boolean
  isRetweeted: boolean
  isBookmarked: boolean
}

// Sample data arrays
const usernames = [
  'alex_tech', 'sarah_creative', 'mike_gamer', 'lisa_artist', 'david_music',
  'emma_writer', 'james_photo', 'anna_design', 'tom_coding', 'sophie_travel',
  'ryan_sports', 'zoe_food', 'chris_news', 'maya_fashion', 'jake_tech',
  'luna_art', 'noah_gaming', 'ava_music', 'liam_photo', 'olivia_writer'
]

const displayNames = [
  'Alex Johnson', 'Sarah Chen', 'Mike Rodriguez', 'Lisa Thompson', 'David Kim',
  'Emma Wilson', 'James Brown', 'Anna Davis', 'Tom Miller', 'Sophie Garcia',
  'Ryan Taylor', 'Zoe Anderson', 'Chris Lee', 'Maya Patel', 'Jake White',
  'Luna Martinez', 'Noah Jackson', 'Ava Thompson', 'Liam Davis', 'Olivia Wilson'
]

const avatars = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=150&h=150&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face'
]

const postContents = [
  "Just had an amazing day exploring the city! The architecture here is incredible 🏙️ #citylife #architecture #urban #exploration",
  "Working on a new project and I'm so excited about the possibilities! Can't wait to share more details soon 💻 #coding #tech #innovation #startup",
  "Beautiful sunset from my window today. Sometimes you just need to stop and appreciate the little things 🌅 #sunset #gratitude #mindfulness #beauty",
  "Coffee and coding - the perfect combination for a productive day ☕️ #coffee #coding #productivity #morning #developerlife",
  "Just finished reading an amazing book! Highly recommend it to anyone interested in personal growth 📚 #books #growth #learning #selfimprovement",
  "Had the best time at the concert last night! The energy was incredible 🎵 #music #concert #live #entertainment #energy",
  "Working out this morning felt amazing! Starting the day with exercise always puts me in a great mood 💪 #fitness #motivation #health #wellness",
  "Cooking experiment gone right! This new recipe turned out better than expected 🍳 #cooking #food #experiment #kitchen #homemade",
  "Nature walk was exactly what I needed today. Fresh air and beautiful scenery 🌲 #nature #hiking #peace #outdoors #freshair",
  "Just discovered this amazing new app! It's going to change how I organize my tasks 📱 #productivity #apps #organization #tech #efficiency",
  "Art gallery visit was so inspiring! Love seeing all the creative work on display 🎨 #art #inspiration #creativity #culture #gallery",
  "Movie night with friends was perfect! Sometimes the simple things are the best 🍿 #friends #movies #fun #entertainment #qualitytime",
  "Learning a new language is challenging but so rewarding! Practice makes progress 🌍 #language #learning #growth #education #multilingual",
  "Photography session today was incredible! Love capturing those perfect moments 📸 #photography #moments #creativity #art #capture",
  "Gaming session with friends was epic! Nothing beats good company and great games 🎮 #gaming #friends #fun #entertainment #multiplayer",
  "Just tried a new restaurant and the food was absolutely delicious! 🍽️ #food #restaurant #delicious #culinary #foodie",
  "Travel planning is so exciting! Can't wait for the next adventure ✈️ #travel #adventure #planning #wanderlust #exploration",
  "Music production session was productive today! Love creating new sounds 🎧 #music #production #creativity #studio #sound",
  "Volunteering at the local shelter was such a rewarding experience ❤️ #volunteering #community #helping #charity #givingback",
  "Just finished a challenging workout! Pushing my limits feels amazing 💪 #fitness #challenge #motivation #strength #endurance",
  "Morning meditation session was exactly what I needed. Finding peace in the chaos 🧘‍♀️ #meditation #mindfulness #peace #wellness #calm",
  "Just launched my new website! Months of hard work finally paying off 🚀 #webdev #launch #success #entrepreneur #milestone",
  "Dog park visit was so much fun! Watching all the pups play together 🐕 #dogs #pets #fun #community #animals",
  "Stargazing last night was absolutely magical. The universe never fails to amaze me ✨ #stars #astronomy #night #wonder #cosmos",
  "Just completed a 5K run! Never thought I could do it but here we are 🏃‍♀️ #running #fitness #achievement #goals #pride",
  "Crafting session with friends was so therapeutic. There's something special about creating with your hands 🎨 #crafts #friends #creativity #therapy #handmade",
  "Just tried rock climbing for the first time! It's scarier than I thought but so exhilarating 🧗‍♀️ #climbing #adventure #fear #courage #challenge",
  "Farmer's market visit was incredible! Fresh produce and local vendors make such a difference 🥬 #farmersmarket #local #fresh #community #sustainable",
  "Just finished a 1000-piece puzzle! The satisfaction of that last piece is unmatched 🧩 #puzzles #patience #achievement #mindfulness #focus",
  "Beach day was perfect! Nothing beats the sound of waves and the feeling of sand between your toes 🏖️ #beach #ocean #relaxation #summer #waves",
  "Watching the stars tonight and feeling so small yet connected to the universe ✨ #stars #universe #contemplation #night #perspective",
  "Just completed a 30-day challenge! Consistency is key to success 🏆 #challenge #consistency #success #achievement #discipline",
  "The fall colors are absolutely stunning this year! 🍂 #autumn #colors #nature #beauty #seasonal",
  "Just had an incredible deep conversation with a friend. These moments are priceless 💭 #friendship #conversation #connection #meaningful #relationships",
  "Working from a cozy coffee shop today. The atmosphere is perfect for productivity ☕️ #remotework #coffeeshop #productivity #ambiance #worklife",
  "Just discovered a new hiking trail! The views are absolutely incredible 🥾 #hiking #trail #views #adventure #nature #discovery",
  "The creativity in this art gallery is mind-blowing! So much talent 🎭 #art #gallery #creativity #talent #inspiration #culture",
  "Just finished a meditation session and feeling so centered 🧘‍♀️ #meditation #mindfulness #wellness #peace #balance #zen",
  "The street art in this neighborhood is incredible! Urban creativity at its finest 🎨 #streetart #urban #creativity #art #city #expression",
  "Just had the most amazing sushi! Fresh and delicious 🍣 #sushi #japanese #food #delicious #fresh #culinary",
  "Working on a side project that I'm really passionate about! Sometimes the best work comes from personal projects 🔥 #sideproject #passion #work #creativity #dedication",
  "The sunset over the ocean was absolutely magical tonight 🌊 #sunset #ocean #magical #beauty #nature #serenity",
  "Just learned a new skill today! Never too old to keep learning 📚 #learning #skill #growth #education #curiosity #lifelonglearning",
  "The energy at this music festival is incredible! Live music hits different 🎪 #music #festival #live #energy #entertainment #vibes",
  "Just finished reading a thought-provoking article about the future of work 💼 #future #work #technology #thoughts #article #insights",
  "The architecture in this old town is absolutely stunning! History comes alive 🏛️ #architecture #history #beauty #culture #heritage #timeless",
  "Just had an amazing workout session! Endorphins are flowing 💪 #workout #endorphins #fitness #energy #health #high",
  "The creativity in this maker space is inspiring! So many cool projects being built 🔧 #makerspace #creativity #projects #innovation #building #diy",
  "Just discovered a new favorite book! Can't put it down 📖 #books #reading #favorite #addiction #literature #page-turner",
  "The community garden in my neighborhood is thriving! So much green goodness 🌱 #community #garden #green #nature #sustainability #local",
  "Just had an incredible experience at a local art workshop! Hands-on creativity 🎨 #workshop #art #creativity #hands-on #local #learning",
  "The night sky is so clear tonight! Perfect for stargazing 🌌 #stargazing #night #sky #astronomy #wonder #cosmos #peaceful",
  "Just finished a challenging puzzle! Patience and persistence pay off 🧩 #puzzle #patience #persistence #challenge #satisfaction #mindfulness"
]

const hashtags = [
  'tech', 'coding', 'programming', 'webdev', 'javascript', 'react', 'nodejs',
  'design', 'art', 'creativity', 'photography', 'music', 'gaming', 'fitness',
  'travel', 'food', 'lifestyle', 'motivation', 'inspiration', 'nature',
  'books', 'learning', 'productivity', 'startup', 'entrepreneur', 'business',
  'ai', 'machinelearning', 'data', 'science', 'innovation', 'future'
]

const mediaTypes = ['image', 'video', 'gif'] as const
const imageUrls = [
  'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop&q=80',
  'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop&q=80'
]

const videoUrls = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4'
]

const gifUrls = [
  'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
  'https://media.giphy.com/media/26BRrSvJUaNz0EYBy/giphy.gif',
  'https://media.giphy.com/media/3o7aTskHEUdgCQAXde/giphy.gif',
  'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
  'https://media.giphy.com/media/3o6Zt4HU0hFqgRrTWE/giphy.gif'
]

// Utility functions
function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function getRandomItems<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function getRandomDate(daysAgo: number = 7): string {
  const now = new Date()
  const randomDays = Math.floor(Math.random() * daysAgo)
  const randomDate = new Date(now.getTime() - randomDays * 24 * 60 * 60 * 1000)
  return randomDate.toISOString()
}

// Generate random user
export function generateMockUser(): MockUser {
  const username = getRandomItem(usernames)
  const displayName = getRandomItem(displayNames)
  const avatar = getRandomItem(avatars)
  
  return {
    _id: `user_${Math.random().toString(36).substr(2, 9)}`,
    username,
    displayName,
    avatar,
    verified: Math.random() < 0.1, // 10% chance of being verified
    followersCount: getRandomNumber(50, 50000),
    followingCount: getRandomNumber(20, 2000)
  }
}

// Generate random post
export function generateMockPost(): MockPost {
  const author = generateMockUser()
  const content = getRandomItem(postContents)
  const postHashtags = getRandomItems(hashtags, getRandomNumber(1, 4))
  const mentions = getRandomItems(usernames, getRandomNumber(0, 2))
  
  // Generate media (30% chance of having media)
  const media = Math.random() < 0.3 ? (() => {
    const mediaType = getRandomItem(mediaTypes)
    const mediaCount = getRandomNumber(1, 3)
    
    return Array.from({ length: mediaCount }, () => {
      switch (mediaType) {
        case 'image':
          return {
            type: 'image' as const,
            url: getRandomItem(imageUrls),
            thumbnail: getRandomItem(imageUrls)
          }
        case 'video':
          return {
            type: 'video' as const,
            url: getRandomItem(videoUrls),
            thumbnail: getRandomItem(imageUrls),
            duration: getRandomNumber(30, 300)
          }
        case 'gif':
          return {
            type: 'gif' as const,
            url: getRandomItem(gifUrls)
          }
      }
    })
  })() : []

  return {
    _id: `post_${Math.random().toString(36).substr(2, 9)}`,
    author,
    content,
    media,
    engagement: {
      totalLikes: getRandomNumber(0, 1000),
      totalComments: getRandomNumber(0, 100),
      totalRetweets: getRandomNumber(0, 200),
      totalViews: getRandomNumber(100, 10000)
    },
    hashtags: postHashtags,
    mentions,
    createdAt: getRandomDate(30), // Random date within last 30 days
    isLiked: Math.random() < 0.3,
    isRetweeted: Math.random() < 0.1,
    isBookmarked: Math.random() < 0.2
  }
}

// Generate multiple posts
export function generateMockPosts(count: number): MockPost[] {
  return Array.from({ length: count }, () => generateMockPost())
}

// Generate trending hashtags
export function generateTrendingHashtags(): Array<{ hashtag: string; count: number }> {
  return getRandomItems(hashtags, 10).map(hashtag => ({
    hashtag,
    count: getRandomNumber(100, 10000)
  }))
}

// Generate suggested users
export function generateSuggestedUsers(): MockUser[] {
  return Array.from({ length: 5 }, () => generateMockUser())
}
