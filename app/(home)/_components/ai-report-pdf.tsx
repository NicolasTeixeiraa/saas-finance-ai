import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

interface AiReportPdfProps {
  report: string;
  month: string;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 36,
    paddingBottom: 48,
    paddingHorizontal: 32,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#1f2937",
    backgroundColor: "#ffffff",
  },
  topBar: {
    height: 8,
    backgroundColor: "#22c55e",
    marginBottom: 20,
    borderRadius: 999,
  },
  header: {
    marginBottom: 18,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  title: {
    fontSize: 22,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 10,
    color: "#6b7280",
    marginBottom: 2,
  },
  summaryCard: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 10,
    padding: 14,
    marginBottom: 18,
  },
  summaryTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 10,
    color: "#4b5563",
    marginBottom: 3,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    color: "#111827",
    marginBottom: 10,
    marginTop: 6,
  },
  paragraph: {
    fontSize: 11,
    lineHeight: 1.7,
    marginBottom: 10,
    textAlign: "justify",
  },
  highlightBox: {
    backgroundColor: "#eff6ff",
    borderLeftWidth: 4,
    borderLeftColor: "#2563eb",
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginTop: 8,
    marginBottom: 14,
  },
  highlightText: {
    fontSize: 10,
    color: "#1e3a8a",
    lineHeight: 1.6,
  },
  footer: {
    position: "absolute",
    bottom: 18,
    left: 32,
    right: 32,
    fontSize: 9,
    color: "#9ca3af",
    textAlign: "center",
  },
});

const getMonthLabel = (month: string) => {
  const months: Record<string, string> = {
    "01": "Janeiro",
    "02": "Fevereiro",
    "03": "Março",
    "04": "Abril",
    "05": "Maio",
    "06": "Junho",
    "07": "Julho",
    "08": "Agosto",
    "09": "Setembro",
    "10": "Outubro",
    "11": "Novembro",
    "12": "Dezembro",
  };

  return months[month] ?? month;
};

const normalizeParagraphs = (report: string) => {
  return report
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) =>
      line
        .replace(/^#{1,6}\s*/g, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/\*(.*?)\*/g, "$1")
        .replace(/^---$/g, "")
        .replace(/^- /g, "• "),
    )
    .filter(Boolean);
};

const AiReportPdf = ({ report, month }: AiReportPdfProps) => {
  const paragraphs = normalizeParagraphs(report);
  const generatedAt = new Date().toLocaleDateString("pt-BR");

  return (
    <Document
      title="Relatório Financeiro com IA"
      author="Finance AI"
      subject="Relatório financeiro mensal"
      keywords="finanças, relatório, ia, orçamento"
    >
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.topBar} />

        <View style={styles.header}>
          <Text style={styles.title}>Relatório Financeiro com IA</Text>
          <Text style={styles.subtitle}>
            Mês de referência: {getMonthLabel(month)}
          </Text>
          <Text style={styles.subtitle}>Gerado em: {generatedAt}</Text>
        </View>

        <View style={styles.summaryCard} wrap={false}>
          <Text style={styles.summaryTitle}>Resumo do documento</Text>
          <Text style={styles.summaryText}>
            Este relatório apresenta observações e recomendações geradas por IA
            com base nas transações do período selecionado.
          </Text>
          <Text style={styles.summaryText}>
            Período analisado: {getMonthLabel(month)}
          </Text>
          <Text style={styles.summaryText}>Data de emissão: {generatedAt}</Text>
        </View>

        <Text style={styles.sectionTitle}>Análise</Text>

        <View style={styles.highlightBox} wrap={false}>
          <Text style={styles.highlightText}>
            Este material tem caráter informativo e busca apoiar sua organização
            financeira a partir do comportamento observado nas transações.
          </Text>
        </View>

        {paragraphs.map((paragraph, index) => (
          <Text key={index} style={styles.paragraph}>
            {paragraph}
          </Text>
        ))}

        <Text
          fixed
          style={styles.footer}
          render={({ pageNumber, totalPages }) =>
            `Relatório Financeiro com IA • Página ${pageNumber} / ${totalPages}`
          }
        />
      </Page>
    </Document>
  );
};

export default AiReportPdf;
