'use client'

import { useState } from 'react';
import { Home, Edit, Users, Search, Settings, LogIn, ChevronDown } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import LoginButton from "@/components/loginButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Session } from "next-auth";

// Menu items
const items = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  },
  {
    title: "Create Blog",
    url: "/create",
    icon: Edit,
    requiresAuth: true,
  },
  {
    title: "Search",
    url: "/search",
    icon: Search,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  {
    title: "Users",
    url: "#",
    icon: Users,
  },
];

interface User {
  _id: { toString(): string };
  username: string;
  name: string;
  email: string;
}

export function AppSidebar({ session, users = [] }: { session: Session | null; users?: User[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sidebar>
      <SidebarHeader className="dark:bg-slate-800 dark:text-slate-200 bg-slate-200 text-black">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors">
          <span>Overview</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="dark:bg-slate-800 dark:text-slate-200 bg-slate-200 text-black">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                item.title !== "Users" && (!item.requiresAuth || session) && (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} className="flex items-center space-x-2 px-3 py-2 rounded-md dark:hover:bg-slate-700 hover:bg-slate-300 transition-colors">
                        <item.icon className="dark:text-slate-400 text-slate-900" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              ))}
              
              <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/collapsible" >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton className="flex items-center justify-between space-x-2 px-3 py-2 rounded-md transition-colors w-full hover:!bg-slate-300 dark:hover:!bg-slate-700">
                      <div className="flex items-center space-x-4">
                        <Users className="w-4 h-4 dark:text-slate-400 text-slate-900" />
                        <span>Users</span>
                      </div>
                      <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {users.length > 0 ? (
                        users.map((user: User) => (
                          <SidebarMenuSubItem key={user.username}>
                            <a href={`/user/${user.username}`} className="block px-3 py-2 rounded-md dark:hover:bg-slate-700 hover:bg-slate-300 transition-colors">
                              {user.username}
                            </a>
                          </SidebarMenuSubItem>
                        ))
                      ) : (
                        <SidebarMenuSubItem>
                          <span className="block px-3 py-2">No users found</span>
                        </SidebarMenuSubItem>
                      )}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="dark:bg-slate-800 dark:text-slate-200 bg-slate-200 text-black">
        <div className="flex items-center space-x-3 px-3 py-2 rounded-md dark:hover:bg-slate-700 hover:bg-slate-300 transition-colors">
          <LogIn className="w-4 h-4 dark:text-slate-400 text-slate-900" />
          <LoginButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
