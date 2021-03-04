import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '首页', icon: 'dashboard' }
      }
    ]
  },

  {
    path: '/tag',
    component: Layout,
    redirect: '/blog/list',
    name: 'Tags',
    meta: { title: '标签', icon: 'tag' },
    children: [
      {
        path: 'index',
        name: 'Tag',
        component: () => import('@/views/tag/index'),
        meta: { title: '标签', icon: 'tag', breadcrumb: false }
      }
    ]
  },

  {
    path: '/cat',
    component: Layout,
    redirect: '/cat/list',
    name: 'Cats',
    meta: { title: '猫猫', icon: 'cat' },
    children: [
      {
        path: 'index',
        name: 'Cat',
        component: () => import('@/views/cat/index'),
        meta: { title: '猫猫', icon: 'cat', breadcrumb: false }
      }
    ]
  },

  {
    path: '/blog',
    component: Layout,
    redirect: '/blog/list',
    name: 'Blogs',
    meta: { title: '博客', icon: 'blog' },
    children: [
      {
        path: 'index',
        name: 'Blog',
        component: () => import('@/views/blog/index'),
        meta: { title: '博客', icon: 'blog', breadcrumb: false }
      }
    ]
  },

  {
    path: '/article',
    component: Layout,
    redirect: '/article/list',
    name: 'Articles',
    meta: { title: '文章', icon: 'article' },
    children: [
      {
        path: 'list',
        name: 'Article',
        alwaysShow: true,
        component: () => import('@/views/article/index'),
        meta: { title: '文章', icon: 'article', breadcrumb: false }
      }
    ]
  },

  {
    path: '/writting',
    component: Layout,
    redirect: '/writting/article',
    name: 'Writting',
    meta: { title: '写作', icon: 'edit' },
    children: [
      {
        path: 'article',
        name: 'WrittingArticle',
        component: () => import('@/views/writting/article'),
        meta: { title: '文章', icon: 'article' },
        props: true
      },
      {
        path: 'blog',
        name: 'WrittingBlog',
        component: () => import('@/views/writting/blog'),
        meta: { title: '博客', icon: 'blog' },
        props: true
      }
    ]
  },

  {
    path: '*',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

const createRouter = () =>
  new Router({
    mode: 'history',
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  })

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
