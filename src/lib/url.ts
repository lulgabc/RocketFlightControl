export const base = import.meta.env.BASE_URL.replace(/\/$/, "");

/** Prefix an internal path with the GitHub Pages base path. */
export function url(path: string): string {
  if (!path) return base || "/";
  if (/^https?:\/\//.test(path) || path.startsWith("#") || path.startsWith("mailto:")) return path;
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}

/** Remove the base path so nav comparisons work in dev and production. */
export function stripBase(pathname: string): string {
  if (base && pathname.startsWith(base)) {
    const rest = pathname.slice(base.length);
    return rest.startsWith("/") ? rest : `/${rest}`;
  }
  return pathname || "/";
}
