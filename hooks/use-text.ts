import ptBR from "../lib/i18n/pt_BR";

export function useText() {
  return {
    t: (key: string) => ptBR[key] || key,
  };
}
