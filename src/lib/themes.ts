export const isDarkTheme: () => boolean = () => {
  return $('html').attr('data-project-theme')?.includes('dark') || false
}
