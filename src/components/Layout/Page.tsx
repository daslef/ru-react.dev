/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 */

import { Suspense } from 'react';
import * as React from 'react';
import { useRouter } from 'next/router';
import { SidebarNav } from './SidebarNav';
import { Footer } from './Footer';
import { Toc } from './Toc';
import { DocsPageFooter } from 'components/DocsFooter';
import PageHeading from 'components/PageHeading';
import { getRouteMeta } from './getRouteMeta';
import { TocContext } from '../MDX/TocContext';
import { Languages, LanguagesContext } from '../MDX/LanguagesContext';
import type { TocItem } from 'components/MDX/TocContext';
import type { RouteItem } from 'components/Layout/getRouteMeta';
import { HomeContent } from './HomeContent';
import { TopNav } from './TopNav';
import cn from 'classnames';
import Head from 'next/head';

import(/* webpackPrefetch: true */ '../MDX/CodeBlock/CodeBlock');

interface PageProps {
  children: React.ReactNode;
  toc: Array<TocItem>;
  routeTree: RouteItem;
  meta: {
    title?: string;
    titleForTitleTag?: string;
    canary?: boolean;
    description?: string;
  };
  section: 'learn' | 'reference' | 'home' | 'unknown';
  languages?: Languages | null;
}

export function Page({
  children,
  toc,
  routeTree,
  meta,
  section,
  languages = null,
}: PageProps) {
  const { asPath } = useRouter();
  const cleanedPath = asPath.split(/[\?\#]/)[0];
  const { route, nextRoute, prevRoute, breadcrumbs, order } = getRouteMeta(
    cleanedPath,
    routeTree
  );
  const title = meta.title || route?.title || '';
  const canary = meta.canary || false;
  const description = meta.description || route?.description || '';
  const isHomePage = cleanedPath === '/';

  let content;
  if (isHomePage) {
    content = <HomeContent />;
  } else {
    content = (
      <div className="ps-0">
        <div>
          <PageHeading
            title={title}
            canary={canary}
            description={description}
            tags={route?.tags}
            breadcrumbs={breadcrumbs}
          />
        </div>
        <div className="px-5 sm:px-12">
          <div
            className={cn(
              'max-w-7xl mx-auto',
            )}>
            <TocContext.Provider value={toc}>
              <LanguagesContext.Provider value={languages}>
                {children}
              </LanguagesContext.Provider>
            </TocContext.Provider>
          </div>
          <DocsPageFooter
            route={route}
            nextRoute={nextRoute}
            prevRoute={prevRoute}
          />
        </div>
      </div>
    );
  }

  let hasColumns = true;
  let showSidebar = true;
  let showToc = true;
  if (isHomePage) {
    hasColumns = false;
    showSidebar = false;
    showToc = false;
  }

  return (
    <>
      <TopNav
        section={section}
        routeTree={routeTree}
        breadcrumbs={breadcrumbs}
      />
      <div
        className={cn(
          hasColumns &&
          'grid grid-cols-only-content lg:grid-cols-sidebar-content 2xl:grid-cols-sidebar-content-toc'
        )}>
        {showSidebar && (
          <div className="lg:-mt-16 z-10">
            <div className="fixed top-0 py-0 shadow lg:pt-16 lg:sticky start-0 end-0 lg:shadow-none">
              <SidebarNav
                key={section}
                routeTree={routeTree}
                breadcrumbs={breadcrumbs}
              />
            </div>
          </div>
        )}
        {/* No fallback UI so need to be careful not to suspend directly inside. */}
        <Suspense fallback={null}>
          <main className="min-w-0 isolate">
            <article
              className="font-normal break-words text-primary dark:text-primary-dark"
              key={asPath}>
              {content}
            </article>
            <div
              className={cn(
                'self-stretch w-full',
                isHomePage && 'bg-wash dark:bg-gray-95 mt-[-1px]'
              )}>
              {!isHomePage && (
                <div className="w-full px-5 pt-10 mx-auto sm:px-12 md:px-12 md:pt-12 lg:pt-10">
                  <hr className="mx-auto max-w-7xl border-border dark:border-border-dark" />
                </div>
              )}
              <div
                className={cn(
                  'py-12 px-5 sm:px-12 md:px-12 sm:py-12 md:py-16 lg:py-14',
                  isHomePage && 'lg:pt-0'
                )}>
                <Footer />
              </div>
            </div>
          </main>
        </Suspense>
        <div className="hidden -mt-16 lg:max-w-custom-xs 2xl:block">
          {showToc && toc.length > 0 && <Toc headings={toc} key={asPath} />}
        </div>
      </div>
    </>
  );
}
