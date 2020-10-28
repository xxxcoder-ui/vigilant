import { MenuItem } from 'components/atoms'
import * as React from 'react'
import { Link } from 'react-router-dom'

export interface SidebarItem {
  title: string
  iconType: string
  path: string
}

interface Props {
  routes: SidebarItem[]
  activePath: string
}

class MainSidebar extends React.Component<Props, {}> {
  mapRouteItems = (routeItems: SidebarItem[], pathname: string) => {
    return routeItems.map((r, i) => {
      const path = pathname.split('/')[1]
      return (
        <Link key={i} to={r.path}>
          <MenuItem title={r.title} iconType={r.iconType} active={r.path === path} />
        </Link>
      )
    })
  }
  render() {
    const { routes, activePath } = this.props
    return <React.Fragment>{this.mapRouteItems(routes, activePath)}</React.Fragment>
  }
}

export { MainSidebar }
