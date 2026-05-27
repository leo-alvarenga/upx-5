import { useTranslation } from 'react-i18next'

export function useText() {
  const { t } = useTranslation()
  return { t }
}
