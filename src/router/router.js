import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import History from '../components/tailwind/page/History.vue'
import Search from '../components/tailwind/page/Search.vue'
import AnimatedAnalytics from '../components/tailwind/page/AnimatedAnalytics.vue'
import Settings from '../components/tailwind/Settings.vue'
import MainLayout from '../components/tailwind/layout/MainLayout.vue'
import Images from '../components/tailwind/page/Images.vue'
import SchedulerTasks from '../components/tailwind/page/SchedulerTasks.vue'
import Downloads from '../components/tailwind/page/Downloads.vue'
import MediaManager from '../components/tailwind/page/MediaManager.vue'
import Favorites from '../components/tailwind/page/Favorites.vue'
import BiliTools from '../components/tailwind/page/BiliTools.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        component: History,
      },
      {
        path: 'page/:pageNumber',
        component: History,
      },
      {
        path: 'search/:keyword',
        name: 'Search',
        component: Search,
      },
      {
        path: 'search/:keyword/page/:pageNumber',
        name: 'SearchPage',
        component: Search,
      },
      {
        path: 'analytics',
        name: 'AnimatedAnalytics',
        component: AnimatedAnalytics,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
      {
        path: 'remarks',
        name: 'Remarks',
        redirect: '/media?tab=remarks'
      },
      {
        path: 'images',
        name: 'Images',
        component: Images
      },
      {
        path: 'scheduler',
        name: 'SchedulerTasks',
        component: SchedulerTasks
      },
      {
        path: 'downloads',
        name: 'Downloads',
        component: Downloads
      },
      {
        path: 'comments',
        name: 'Comments',
        redirect: '/media?tab=comments'
      },
      {
        path: 'media',
        name: 'MediaManager',
        component: MediaManager
      },
      {
        path: 'about',
        name: 'About',
        redirect: '/settings?tab=about'
      },
      {
        path: 'favorites',
        name: 'Favorites',
        component: Favorites
      },
      {
        path: 'video-downloader',
        name: 'VideoDownloader',
        redirect: '/bili-tools?tab=video-download'
      },
      {
        path: 'bili-tools',
        name: 'BiliTools',
        component: BiliTools
      }
    ]
  }
]

// 创建路由实例的工厂函数
export const createMyRouter = (mode = 'hash') => {

  const history = mode === 'hash' ? createWebHashHistory() : createWebHistory()

  return createRouter({
    history,
    routes,
  })
}
