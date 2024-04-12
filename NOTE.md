### NOTE
#### Notification
(ex: users):

the state for the notification count is in app.reducers.ts
1. dispatch the notification in onDashboardEnter
2. in user.action.ts
- add the search params to the pushed url because it redirects with a search params ?tab=new
- this will redirect to Users.tsx page with the default tab "new"
export const goToUsers = (search?: ITabSearchParams) => ({ to: PATH_NAMES.users, search });
3. in components/layouts/notifications/NotificationIcons.tsx
- add the icon and actions in the options

### TEXT EDITOR
- exemple
(Repo)[https://github.com/ZanyuanYang/Text-Editor-Tiptap/blob/master/src/pages/TextEditor/components/Tiptap.tsx]
(Demo)[https://text-editor-tiptap.vercel.app/]
(My demo)[https://codesandbox.io/s/github/tiavina-mika/tiptap-editor-mui]
