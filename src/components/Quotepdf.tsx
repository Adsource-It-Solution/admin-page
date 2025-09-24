import React from "react";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

Font.register({
  family: "Roboto",
  src: "https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap",
});


type Row = {
  description: string;
  price: number;
  quantity: number;
  note?: string;
};

type QuotePDFProps = {
  rows: Row[];
  gst: number;
  numberToWords: (num: number) => string;
};

const styles = StyleSheet.create({
  page: { padding: 20, fontFamily: "Roboto", fontSize: 10, lineHeight: 1.4 },
  table: { width: "auto", marginTop: 10 },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
  },
  headerRow: { backgroundColor: "#003366" },
  headerCell: {
    color: "white",
    padding: 6,
    fontWeight: "bold",
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
  },
  cell: {
    padding: 6,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#000",
    fontSize: 10,
  },
  firstCell: { width: 30, textAlign: "center" },
  descriptionCell: { flexGrow: 3 },
  priceCell: { flexGrow: 2, textAlign: "right" },
  quantityCell: { flexGrow: 1, textAlign: "center" },
  subtotalCell: { flexGrow: 2, textAlign: "right" },
  totalRow: { backgroundColor: "#003366", color: "white", fontWeight: "bold" },
  wordsRow: {
    backgroundColor: "#003366",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
});

// Utility functions
const calculateSubtotal = (rows: Row[]) => rows.reduce((acc, r) => acc + r.price * r.quantity, 0);
const calculateGSTAmount = (subtotal: number, gst: number) => (subtotal * gst) / 100;
const calculateTotal = (subtotal: number, gstAmount: number) => subtotal + gstAmount;

// Table header component
const TableHeader: React.FC = () => (
  <View style={[styles.row, styles.headerRow]}>
    <Text style={[styles.headerCell, styles.firstCell]}></Text>
    <Text style={[styles.headerCell, styles.descriptionCell]}>Description</Text>
    <Text style={[styles.headerCell, styles.priceCell]}>Price / kW</Text>
    <Text style={[styles.headerCell, styles.quantityCell]}>Quantity</Text>
    <Text style={[styles.headerCell, styles.subtotalCell]}>Subtotal</Text>
  </View>
);

const QuotePDF: React.FC<QuotePDFProps> = ({ rows, gst, numberToWords }) => {
  const subtotal = calculateSubtotal(rows);
  const gstAmount = calculateGSTAmount(subtotal, gst);
  const total = calculateTotal(subtotal, gstAmount);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 10 }}>
          Solar Proposal
        </Text>

        <View style={styles.table}>
          <TableHeader />

          {rows.map((row, index) => (
            <View
              key={index}
              style={[
                styles.row,
                { backgroundColor: index % 2 === 0 ? "#f0f6ff" : "white" },
              ]}
            >
              <Text style={[styles.cell, styles.firstCell]}>{index + 1}</Text>
              <Text style={[styles.cell, styles.descriptionCell]}>{row.description}</Text>
              <Text style={[styles.cell, styles.priceCell]}>₹ {row.price}</Text>
              <Text style={[styles.cell, styles.quantityCell]}>{row.quantity}</Text>
              <Text style={[styles.cell, styles.subtotalCell]}>
                ₹ {(row.price * row.quantity).toLocaleString("en-IN")}
              </Text>
            </View>
          ))}

          {/* Subtotal */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.firstCell]}></Text>
            <Text style={[styles.cell, styles.descriptionCell]}>Subtotal</Text>
            <Text style={[styles.cell, styles.priceCell]}>
              ₹ {subtotal.toLocaleString("en-IN")}
            </Text>
            <Text style={[styles.cell, styles.quantityCell]}></Text>
            <Text style={[styles.cell, styles.subtotalCell]}></Text>
          </View>

          {/* GST */}
          <View style={styles.row}>
            <Text style={[styles.cell, styles.firstCell]}></Text>
            <Text style={[styles.cell, styles.descriptionCell]}>GST %</Text>
            <Text style={[styles.cell, styles.priceCell]}>{gst}%</Text>
            <Text style={[styles.cell, styles.quantityCell]}></Text>
            <Text style={[styles.cell, styles.subtotalCell]}>
              ₹ {gstAmount.toLocaleString("en-IN")}
            </Text>
          </View>

          {/* Total */}
          <View style={[styles.row, styles.totalRow]}>
            <Text style={[styles.cell, styles.firstCell]}></Text>
            <Text style={[styles.cell, styles.descriptionCell]}>Total Cost</Text>
            <Text style={[styles.cell, styles.priceCell]}></Text>
            <Text style={[styles.cell, styles.quantityCell]}></Text>
            <Text style={[styles.cell, styles.subtotalCell]}>
              ₹ {total.toLocaleString("en-IN")}
            </Text>
          </View>

          {/* Amount in Words */}
          <View style={styles.wordsRow}>
            <Text>Amount in Words:</Text>
            <Text>{numberToWords(total)}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default QuotePDF;
