import { useAppStore } from '@/store';
//request拦截器
uni.addInterceptor('request', {
    invoke(args: UniApp.RequestOptions) {
        uni.showLoading({ title: '加载中' })
        args.header = {
            ...args.header,
            token: 'token'
        }
        return args
    },
    success(res) {
    },
    fail() {

    },
    complete() {
        uni.hideLoading()
    }
})
//跳转拦截器
const methodToPatch = ['navigateTo', 'redirectTo', 'switchTab', 'navigateBack']
methodToPatch.map(item => {
    const original = uni[item] // 
    uni[item] = function (opt = {}, needAuth) {
        const appStore = useAppStore()
        if (needAuth && !appStore.token) { // 需要登录且未登录
            console.log(appStore.token);
            
            uni.navigateTo({
                url: '/pages/login/index'
            })
            uni.showToast({title:'请登录'})
        } else {
            return original.call(this, opt)
        }
    }
})
//授权拦截器
type Scope = {
    method: string
    scope: string
}
const scope: Scope[] = [
    {
        method: 'getUserInfo',
        scope: 'scope.userInfo'
    },
    {
        method: 'chooseLocation',
        scope: 'scope.userLocation'
    },
    {
        method: 'getLocation',
        scope: 'scope.userLocation'
    },
    {
        method: 'userLocationBackground',
        scope: 'scope.userLocationBackground'
    },
    {
        method: 'chooseAddress',
        scope: 'scope.address'
    },
    {
        method: 'getRecorderManager',
        scope: 'scope.record'
    },
    {
        method: 'saveImageToPhotosAlbum',
        scope: 'scope.writePhotosAlbum'
    },
    {
        method: 'saveVideoToPhotosAlbum',
        scope: 'scope.writePhotosAlbum'
    },
    {
        method: 'chooseInvoice',
        scope: 'scope.invoice'
    },
    {
        method: 'chooseInvoiceTitle',
        scope: 'scope.invoiceTitle'
    },
    {
        method: 'getWeRunData',
        scope: 'scope.werun'
    },

]
// #ifndef H5
for (const item of scope) {
    uni.addInterceptor(item.method, {
        invoke(res) {
            // 打开引导提示
            uni.authorize({
                scope: item.scope, fail: err => {
                    uni.openSetting({
                        success: res => {
                            console.log(res);

                        }, fail: err => {
                            console.log(err);
                        }
                    })
                }
            })
        },
        complete() {
            // 关闭提示
        }
    })
}
// #endif