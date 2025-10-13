import React from "react";
import {
    Document,
    Page,
    Text,
    View,
    Image,
    StyleSheet,
    Svg,
    Rect,
    Font
} from "@react-pdf/renderer";
import type { Proposal } from "../pages/Proposal"
import communicate from "../assets/communication.png"
// import solarbackground from "../assets/solar_background.jpg"
import logo from "../assets/logo.jpg"
import phonecall from "../assets/phone-call.png"
import solarproposal from "../assets/Solar_Proposal.jpg"
import solargeneration from "../assets/solar-generation.png"
import solarpowerplant from "../assets/solar-power-plant.png"
import worldwide from "../assets/worldwide.png"
import location from "../assets/icons8-location-94.png"
import Bill from "../assets/Billimage.png"
import calander from "../assets/calendar.png"
import banner from "../assets/banner.png"
import { ToWords } from 'to-words';
import graphpageimage from "../assets/graphpageimage.png"
const toWords = new ToWords({ localeCode: "en-IN" });

Font.register({
    family: 'Work Sans',
    fonts: [
        { src: '/fonts/Work_Sans/static/WorkSans-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/Work_Sans/static/WorkSans-Bold.ttf', fontWeight: 'bold' },
        { src: '/fonts/Work_Sans/static/WorkSans-Medium.ttf', fontWeight: 'medium' },
        { src: '/fonts/Work_Sans/static/WorkSans-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' },
        { src: '/fonts/Work_Sans/static/WorkSans-Black.ttf' },
    ],
});
Font.register({
    family: 'Roboto',
    fonts: [
        { src: '/fonts/Roboto/static/Roboto-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/Roboto/static/Roboto-Bold.ttf', fontWeight: 'bold' },
        { src: '/fonts/Roboto/static/Roboto-Medium.ttf', fontWeight: 'medium' },
        { src: '/fonts/Roboto/static/Roboto-BoldItalic.ttf', fontWeight: 'bold', fontStyle: 'italic' },
        { src: '/fonts/Roboto/static/Roboto-Black.ttf' },
    ],
});
Font.register({
    family: 'Poppins',
    fonts: [
        { src: '/fonts/Poppins/Poppins-Regular.ttf', fontWeight: 'normal' },
        { src: '/fonts/Poppins/Poppins-Bold.ttf', fontWeight: 'bold' },
    ]
})
// PDF Styles
const styles = StyleSheet.create({
    page: { paddingLeft: 25, paddingRight: 25, paddingTop: 20, fontFamily: "Work Sans", fontSize: 12 },
    page2: { paddingLeft: 25, paddingRight: 25, paddingTop: 48, fontFamily: "Work Sans", fontSize: 12 },
    header: { fontFamily: 'Work Sans', fontSize: 32, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
    subHeader: { fontFamily: 'Roboto', fontSize: 24, fontWeight: "bold", marginBottom: 10 },
    subHeader2: { fontFamily: 'Poppins', fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#1e40af" },
    text: { marginBottom: 5 },
    listItem: { fontFamily: 'Roboto', marginLeft: 15, marginBottom: 5, fontSize: 16 },
    logo: { width: 100, height: 70 },
    logoTop: { width: 120, height: 50, resizeMode: "contain", alignSelf: "flex-end", },
    smallLogo: { width: 60, height: 60, marginVertical: 10 },
    image: { width: "100%", height: "100%", objectFit: "contain", marginVertical: 10 },
    smallImage: { width: 20, height: 20, marginRight: 5 },
    section: { marginBottom: 20 },
    row: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
    rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 5 },
    row2: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginVertical: 10 },
    column2: { flex: 1, marginRight: 20 },
    colimn3: { flex: 1, marginLeft: 20 },
    label2: { fontFamily: 'Poppins', fontWeight: "bold", marginBottom: 4, fontSize: 20 },
    text2: { fontSize: 16, marginBottom: 2 },
    specRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
    specCol: { width: "30%" },
    specTitle: { fontFamily: 'Work Sans', fontWeight: "bold", marginBottom: 4, fontSize: 16 },
    blueLine: { backgroundColor: "#696969", height: 2, marginTop: 5, width: "100%" },
    headerContainer: { alignItems: "center", marginBottom: 20 },
    mainTitle: { fontFamily: 'Work Sans', fontSize: 48, fontWeight: "bold", marginBottom: 10, color: "#f97316" },
    subTitle: { fontFamily: 'Roboto', fontSize: 32, fontWeight: "bold", color: "#2563eb", marginBottom: 20 },
    label: { fontFamily: 'Poppins', fontSize: 14, fontWeight: "bold", marginBottom: 2 },
    column: { flexDirection: "column" },
    footer2: { position: "absolute", bottom: 30, left: 30, right: 30, fontSize: 10, color: "#6b7280", textAlign: "center" },
    table: { display: "flex", width: "auto", borderStyle: "solid", },
    tableRow: { flexDirection: "row", paddingVertical: 4 },
    tableHeader: { backgroundColor: "#003366", marginBottom: 2 },
    tableColHeader: { flex: 1, fontSize: 16, fontFamily: "Roboto", fontWeight: "bold", color: "#fff", padding: 2 },
    tableCol: { flex: 1, fontSize: 14, fontFamily: "Poppins", paddingHorizontal: 2, paddingVertical: 2, backgroundColor: "#f0f6ff" },
    tableColprice: { flex: 1, fontSize: 14, fontFamily: "Poppins", paddingHorizontal: 2, paddingVertical: 2, backgroundColor: "#f0f6ff" },
    tableColquantity: { flex: 1, fontSize: 14, fontFamily: "Poppins", paddingHorizontal: 2, paddingVertical: 2, backgroundColor: "#f0f6ff" },
    tableColtotal: { flex: 1, fontSize: 14, fontFamily: "Poppins", paddingHorizontal: 2, paddingVertical: 2, backgroundColor: "#f0f6ff" },
    totalRow: { flexDirection: "row", backgroundColor: "#003366", paddingVertical: 4, justifyContent: "space-between" },
    totalText: { flex: 1, fontSize: 14, fontWeight: "bold", color: "#fff", paddingHorizontal: 2 },
    amountWords: { fontSize: 14, fontWeight: "bold", color: "#fff", padding: 2, marginRight: 2 },
});

interface SolarProposalPDFProps { proposal: Proposal; }
interface BarChart10YearsProps {
    consumption: number;
    generation: number;
    width?: number;
    height?: number;
}

// Graph component

const LineChart10Years: React.FC<BarChart10YearsProps> = ({
    consumption,
    generation,
    width = 400,
    height = 180,
}) => {
    if (consumption === 0 && generation === 0) return null;

    // Generate 10-year data
    const data = Array.from({ length: 10 }, (_, i) => ({
        year: (i + 1).toString(), // start from 1
        increment: consumption * Math.pow(1 + 0.02, i), // +2% per year
        decrement: generation * Math.pow(1 - 0.004, i), // -0.4% per year
    }));

    const padding = 30;
    const chartWidth = width - padding;
    const chartHeight = height - padding * 2;
    const stepX = chartWidth / data.length;

    // Determine Y-axis max based on consumption or generation, nearest greater multiple of 1000
    const maxValue = Math.max(...data.flatMap((d) => [d.increment, d.decrement]));
    const yAxisMax = Math.ceil(maxValue / 1000) * 1000;

    const yAxisSteps = 6;
    const yStepValue = yAxisMax / yAxisSteps;

    const getY = (value: number) =>
        height - padding - (value / yAxisMax) * chartHeight;

    const barBase = height - padding;

    return (
        <View style={{ marginTop: 10 }}>
            <Svg width={width} height={height}>
                {/* Axes */}
                <Rect x={padding - 1} y={padding} width={1} height={chartHeight} fill="#000" />
                <Rect x={padding} y={height - padding} width={chartWidth} height={1} fill="#000" />

                {/* Y-axis labels and grid lines */}
                {Array.from({ length: yAxisSteps + 1 }, (_, i) => {
                    const yValue = i * yStepValue;
                    const yPos = height - padding - (yValue / yAxisMax) * chartHeight;

                    return (
                        <React.Fragment key={i}>
                            {i !== 0 && (
                                <Rect
                                    x={padding}
                                    y={yPos}
                                    width={chartWidth}
                                    height={1}
                                    fill="#ccc"
                                    opacity={0.5}
                                />
                            )}
                            <Text
                                x={padding - 25}
                                y={yPos + 3}
                                style={{ fontSize: 8, fill: "#000" }}
                            >
                                {Math.round(yValue).toLocaleString()}
                            </Text>
                        </React.Fragment>
                    );
                })}

                {/* Y-axis Title */}
                <Text
                    x={15}
                    y={height / 2}
                    style={{ fontSize: 14, fill: "#000" }}
                    transform={`rotate(-90, 15, ${height / 2})`}
                >
                    Amount (kWh)
                </Text>

                {/* Bars */}
                {data.map((d, i) => {
                    const barWidth = stepX / 3;
                    const x = padding + (i + 0.5) * stepX - barWidth;

                    return (
                        <React.Fragment key={i}>
                            <Rect
                                x={x}
                                y={getY(d.increment)}
                                width={barWidth}
                                height={barBase - getY(d.increment)}
                                fill="#1f3c88"
                            />
                            <Rect
                                x={x + barWidth + 2}
                                y={getY(d.decrement)}
                                width={barWidth}
                                height={barBase - getY(d.decrement)}
                                fill="#f97316"
                            />
                            <Text x={x} y={height - padding + 10} style={{ fontSize: 8 }}>
                                {d.year} Year
                            </Text>
                        </React.Fragment>
                    );
                })}

                {/* Legend */}
                <Rect x={padding} y={12} width={12} height={12} fill="#1f3c88" />
                <Text x={padding + 14} y={22} style={{ fontSize: 14, fill: "#1f3c88" }}>
                    Increment
                </Text>

                <Rect x={padding + 100} y={12} width={12} height={12} fill="#f97316" />
                <Text x={padding + 118} y={22} style={{ fontSize: 14, fill: "#f97316" }}>
                    Decrement
                </Text>
            </Svg>
        </View>
    );
};

const numberToWords = (num: number): string => {
    if (!num) return "Zero Rupees Only";

    const [rupees, paise] = num.toString().split(".");

    let rupeesInWords = toWords
        .convert(Number(rupees))
        .replace(/\b[a-z]/g, (char) => char.toUpperCase());

    let paiseInWords = "";
    if (paise && Number(paise) > 0) {
        // Convert paise part (limit to two digits)
        const paiseValue = Number(paise.padEnd(2, "0").slice(0, 2));
        paiseInWords =
            " And " +
            toWords
                .convert(paiseValue)
                .replace(/\b[a-z]/g, (char) => char.toUpperCase()) +
            " Paise";
    }

    return `${rupeesInWords} Rupees${paiseInWords} Only`;
};



export const SolarProposalPDF: React.FC<SolarProposalPDFProps> = ({ proposal }) => (
    <Document>
        {/* PAGE 1: COVER */}
        <Page size="A4" style={styles.page}>
            <View>

                <Image src={logo} style={styles.logoTop} />
            </View>
            {/* Prepared By / For */}
            <View style={styles.row2}>
                <View style={styles.column2}>
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, fontWeight: "Bold" }}>Prepared For</Text>
                    <Text style={{
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        lineHeight: 1.5,
                        textAlign: "justify",
                    }}>{proposal.clienttitle} {proposal.clientName}</Text>

                    {proposal.clientAddress ? (
                        <Text style={{
                            fontFamily: 'Poppins',
                            fontSize: 12,
                            lineHeight: 1.5,
                            textAlign: "justify",
                        }}>
                            <Image source={location} style={{ width: 12, height: 12, marginRight: 4 }} /><Text>  {proposal.clientAddress}</Text>
                        </Text>) : null}
                    <View style={styles.row}>

                        {proposal.clientPhone ? (
                            <Text style={{
                                fontFamily: 'Poppins',
                                fontSize: 12,
                                lineHeight: 1.5,
                                textAlign: "justify",
                            }}>
                                <Image source={phonecall} style={{ width: 12, height: 12, marginRight: 4 }} /><Text>  {proposal.clientPhone}</Text>
                            </Text>) : null}
                    </View>
                    <View style={styles.row}>
                        {proposal.clientEmail ? (
                            <Text style={{
                                fontFamily: 'Poppins',
                                fontSize: 12,
                                lineHeight: 1.5,
                                textAlign: "justify",
                            }}>
                                <Image source={communicate} style={{ width: 12, height: 12, marginRight: 4 }} /><Text>  {proposal.clientEmail}</Text>
                            </Text>) : null}
                    </View>
                    <Text style={{
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        lineHeight: 1.5,
                        textAlign: "justify",
                    }}>
                        <Image src={calander} style={{ width: 12, height: 12, marginRight: 4 }} />  Date: {proposal.date
                            ? new Date(proposal.date).toLocaleDateString("en-GB")
                            : "NA"}
                    </Text>
                </View>
                <View style={{ marginTop: 2, }}>
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, fontWeight: "Bold" }}>Sunmayo Private Limited</Text>
                    <View>
                        <Text style={{
                            fontFamily: 'Poppins',
                            fontSize: 12,
                            lineHeight: 1.5,
                            textAlign: "justify",
                        }}><Image source={location} style={{ width: 12, height: 12, marginRight: 4 }} />26/18 Laxmi Garden, Sector 11,</Text>
                        <Text style={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            textAlign: "justify",
                        }}>   Gurgaon, Haryana 122001</Text>
                    </View>
                    <View style={styles.row}>
                        <Image src={phonecall} style={{ width: 12, height: 12, marginRight: 4 }} />
                        <Text style={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            textAlign: "justify",
                        }}>+91 9643800850</Text>
                    </View>
                    <View style={styles.row}>
                        <Image src={communicate} style={{ width: 12, height: 12, marginRight: 4 }} />
                        <Text style={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            textAlign: "justify",
                        }}>info@sunmayo.com</Text>
                    </View>
                    <View style={styles.row}>
                        <Image src={worldwide} style={{ width: 12, height: 12, marginRight: 4 }} />
                        <Text style={{
                            fontSize: 12,
                            lineHeight: 1.5,
                            textAlign: "justify",
                        }}>www.sunmayo.com</Text>
                    </View>
                </View>
            </View>
            <View style={{ marginTop: 5 }}>
                <Image src={solarproposal} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </View>
            {/* <Text style={styles.footer2}>Page 1 • Cover</Text> */}
        </Page>

        {/* PAGE 2 */}
        <Page size="A4" style={styles.page}>
            {/* Page 2: Welcome */}
            <View style={{ marginBottom: 10 }}>
                <Text style={{ fontFamily: 'Roboto', fontSize: 28, fontWeight: "bold" }}>
                    Welcome
                </Text>
                <Text style={{ fontFamily: 'Work Sans', fontSize: 24, fontWeight: "600", marginTop: 6, color: "#1e40af" }}>
                    {proposal.clienttitle?.toUpperCase()} {proposal.clientName?.toUpperCase()}
                </Text>
                <View style={styles.blueLine} />

                <Text style={{ fontSize: 20, marginTop: 12, fontWeight: "bold", fontFamily: "Roboto" }}>
                    Dear <Text>{proposal.clientName}</Text>,
                </Text>


                <Text
                    style={{
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        marginTop: 10,
                        lineHeight: 1.5,
                        textAlign: "justify",
                    }}
                >
                    Welcome to a brighter, more sustainable future with our solar solutions. We believe that every customer deserves not
                    just a product, but a complete experience that combines innovation, reliability, and long-term value. Our mission is
                    to deliver energy systems that perform exceptionally well today and continue to do so for decades to come.
                </Text>
                <Text
                    style={{
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        marginTop: 10,
                        lineHeight: 1.5,
                        textAlign: "justify",
                    }}
                >
                    From your very first consultation to the final installation, we’ll walk you through each step of the process with clarity
                    and transparency. Our expert design team ensures that your solar system is tailored to your unique requirements, whether you’re
                    seeking maximum efficiency, aesthetic integration, or future scalability. Every decision we make is guided by our commitment to your
                    satisfaction and peace of mind.
                </Text>
                <Text
                    style={{
                        fontFamily: 'Poppins',
                        fontSize: 14,
                        marginTop: 10,
                        lineHeight: 1.5,
                        textAlign: "justify",
                    }}
                >
                    Together, let’s build a future that’s powered by clean, renewable energy. We are excited to partner with you on this journey
                    and look forward to creating not just a solar project, but a long-term relationship built on trust, service, and shared vision.
                </Text>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: "semibold", marginBottom: 2 }}>• High-efficiency panels with long term performance warranty.</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: "semibold", marginBottom: 2 }}>• Robust hot-dip galvanised elevated structure.</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 14, fontWeight: "semibold", marginBottom: 2 }}>• Turnkey installation with quality-tested BOS components.</Text>
                </View>
                <View style={{ marginTop: 20 }}>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: "bold", fontSize: 14, marginBottom: 4, lineHeight: 1 }}>Thanks & Regards,</Text>
                    <Text style={{ fontFamily: 'Poppins', fontWeight: "600", fontSize: 14, marginBottom: 4, lineHeight: 1 }}>SUNMAYO PRIVATE LIMITED</Text>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4, lineHeight: 1 }}>
                        <Image src={phonecall} style={{ width: 12, height: 12, marginRight: 4 }} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 14 }}>+91 9643800850</Text>
                    </View>
                    <View style={{ flexDirection: "row", alignItems: "center", marginTop: 2, lineHeight: 1 }}>
                        <Image src={communicate} style={{ width: 12, height: 12, marginRight: 4 }} />
                        <Text style={{ fontFamily: 'Poppins', fontSize: 14 }}>info@sunmayo.com</Text>
                    </View>
                </View>
                <Image src={banner} />
            </View>
        </Page>
        {/* PAGE 3: SPECIFICATIONS & GRAPH */}
        <Page size="A4" style={styles.page}>
            <Text style={styles.subHeader}>{proposal.projectsize} KW</Text>
            <Text style={styles.subHeader2}>Specifications</Text>
            <View style={styles.specRow}>
                <View style={styles.specCol}>
                    <Text style={styles.specTitle}>Plant Capacity</Text>
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, marginTop: 8 }}>{proposal.projectsize} KW</Text>
                    <View style={styles.blueLine} />
                </View>
                <View style={styles.specCol}>
                    <Text style={styles.specTitle}>Structure Type</Text>
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, marginTop: 8 }}>{proposal.proposalStructure}</Text>
                    <View style={styles.blueLine} />
                </View>
                <View style={styles.specCol}>
                    <Text style={styles.specTitle}>Inverter</Text>
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, marginTop: 8 }}>{proposal.invertortype || proposal.invertorSize}</Text>
                    <View style={styles.blueLine} />
                </View>
            </View>
            {/* Solar images and yearly consumption */}
            <View style={{ marginTop: 20, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                    <Image src={solarpowerplant} style={styles.logo} />
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, marginTop: 4, fontWeight: "semibold" }}>Yearly consumption:</Text>
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, marginTop: 4, textAlign: "left" }}>{proposal.consumption} kWh</Text>
                </View>
                <View style={{ flexDirection: "column", alignItems: "center" }}>
                    <Image src={solargeneration} style={styles.logo} />
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, marginTop: 4, fontWeight: "semibold" }}>Yearly solar generation:</Text>
                    <Text style={{ fontFamily: 'Work Sans', fontSize: 16, marginTop: 4, textAlign: "left" }}>{proposal.generation} kWh</Text>
                </View>
            </View>
            {/* Graph */}
            <View style={{ marginTop: 20, marginLeft: 28 }}>
                <LineChart10Years
                    consumption={parseFloat(proposal.consumption || "0")}
                    generation={parseFloat(proposal.generation || "0")}
                    width={490}
                    height={300}
                />
            </View>
            <Image style={{ marginTop: 20 }} src={graphpageimage} />
        </Page>

        <Page size="A4" style={styles.page}>
            {/* Commercial Offer & Payment */}
            <View style={styles.section}>
                <Text style={styles.subHeader}>Commercial Offer</Text>
                <Text style={{ fontSize: 16, marginBottom: 5, fontFamily: "Poppins" }}>
                    Price Quote & Payment schedule for {proposal.projectsize} KW {proposal.invertortype} Rooftop Solar System:
                </Text>
                <View style={styles.table}>
                    {/* Header */}
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.tableColHeader}>Description</Text>
                        <Text style={styles.tableColHeader}>Price / kW</Text>
                        <Text style={styles.tableColHeader}>Quantity</Text>
                        <Text style={styles.tableColHeader}>Subtotal</Text>
                    </View>

                    {/* Product Rows */}
                    {proposal.rows.map((row: any, i: number) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.tableCol}>{row.description || "Give Description"}</Text>
                            <Text style={styles.tableColprice}>{row.price || ""}</Text>
                            <Text style={styles.tableColquantity}>{row.quantitytable || ""}</Text>
                            <View style={styles.tableColtotal}>
                                <Text>
                                    {(row.price && row.quantitytable)
                                        ? (row.price * row.quantitytable).toLocaleString("en-IN")
                                        : ""}
                                </Text>
                                {row.note?.trim() ? (
                                    <Text style={{ fontSize: 8 }}>{row.note}</Text>
                                ) : null}
                            </View>
                        </View>
                    ))}


                    {/* Subtotal */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>Subtotal</Text>
                        <Text style={styles.tableColprice}></Text>
                        <Text style={styles.tableColquantity}></Text>
                        <Text style={styles.tableColtotal}>{proposal.subtotal}</Text>
                    </View>

                    {/* GST */}
                    <View style={styles.tableRow}>
                        <Text style={styles.tableCol}>GST %</Text>
                        <Text style={styles.tableColprice}>{proposal.gst > 0 ? `${proposal.gst}%` : ""}</Text>
                        <Text style={styles.tableColquantity}></Text>
                        <Text style={styles.tableColtotal}>
                            {proposal.gstAmount}
                        </Text>
                    </View>

                    {/* Other Charges Rows */}
                    {proposal.otherCharge?.map((charges: any, i: number) => (
                        <View key={i} style={styles.tableRow}>
                            <Text style={styles.tableCol}>{charges.description || "Give Description"}</Text>
                            <Text style={styles.tableColprice}>{charges.price || ""}</Text>
                            <Text style={styles.tableColquantity}>{charges.quantityother || ""}</Text>
                            <View style={styles.tableColtotal}>
                                {/* Subtotal */}
                                <Text>
                                    {(charges.price && charges.quantityother)
                                        ? (charges.price * charges.quantityother).toLocaleString("en-IN")
                                        : ""}
                                </Text>
                                {charges.note?.trim() ? (
                                    <Text style={{ fontSize: 8, }}>
                                        {charges.note}
                                    </Text>
                                ) : null}
                            </View>

                        </View>
                    ))}
                    {/* Total */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalText}>Total Cost</Text>
                        <Text style={styles.totalText}></Text>
                        <Text style={styles.totalText}></Text>
                        <Text style={styles.totalText}>{proposal.total}</Text>
                    </View>

                    {/* Amount in Words */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                            padding: 5,
                            backgroundColor: "#003366",
                            flexWrap: "wrap",
                        }}
                    >
                        <Text style={[styles.amountWords, { flexShrink: 0 }]}>Amount in Words:</Text>
                        <Text
                            style={[
                                styles.amountWords,
                                {
                                    flex: 1,
                                    textAlign: "right",
                                    flexWrap: "wrap",
                                    maxWidth: "70%",
                                },
                            ]}
                        >
                            {numberToWords(proposal.total || 0)}
                        </Text>
                    </View>
                </View>

                {/* Payment Schedule */}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontFamily: "Work Sans", fontWeight: "bold", marginBottom: 5, fontSize: 16 }}>
                        Payment Schedule
                    </Text>
                    <Text style={styles.listItem}>• As a percentage of the Net Value of System.</Text>
                    <Text style={styles.listItem}>• 30% advance along with Purchase Order.</Text>
                    <Text style={styles.listItem}>• 65% Before the Dispatch of material.</Text >
                    <Text style={styles.listItem}>• 5% after installation and commissioning.</Text>
                </View>

                {/* Payment Details */}
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontFamily: "Work Sans", fontWeight: "bold", marginBottom: 8, fontSize: 20 }}>
                        Payment Details
                    </Text>
                    <Text style={{ fontFamily: "Poppins", fontSize: 16 }}>
                        Payment can be paid via Cheque / scanner code / Netbanking
                    </Text>
                    <Text style={{ fontFamily: "Work Sans", fontSize: 16, fontWeight: "bold" }}>
                        {proposal.holder}
                    </Text>
                    <Text style={{ fontFamily: "Work Sans", fontSize: 16 }}>
                        <Text style={{ fontWeight: "bold" }}>Bank:</Text> {proposal.bankname}
                    </Text>
                    <Text style={{ fontFamily: "Work Sans", fontSize: 16 }}>
                        <Text style={{ fontWeight: "bold" }}>A/C:</Text>— {proposal.accountnumber}
                    </Text>
                    <Text style={{ fontFamily: "Work Sans", fontSize: 16 }}>
                        <Text style={{ fontWeight: "bold" }}>IFSC:</Text> {proposal.ifsc}
                    </Text>
                </View>

                {/* Terms */}
                <View style={{ marginTop: 15 }}>
                    <Text style={{ fontFamily: "Poppins", fontSize: 16 }}>
                        Terms: Prices are firm for 10 days from offer date. Delivery 2–3 weeks. Force major applies.
                    </Text>
                </View>
            </View>
        </Page>

        {/* PAGE 5: BILL OF MATERIALS */}
        <Page size="A4" style={styles.page}>
            {/* Bill of Materials Header */}
            <Text style={styles.subHeader}>Bill of Material</Text>

            {/* Watt, Panels, Type */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: 'Poppins', color: "#1d4ed8", fontSize: 16, fontWeight: "bold" }}>Solar Panel</Text>
                <Text style={{ fontFamily: 'Poppins', color: "#1d4ed8", fontSize: 16, fontWeight: "bold" }}>
                    Panel Brands:
                </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Watt Peak: {proposal.Wattpeak} Wp</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Panel NOS: {proposal.quantity}</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>
                        Panel type: {proposal.paneltype}
                    </Text>
                </View>
                {/* <View style={{ backgroundColor: "#696969", width: 2, height: 85, marginLeft: 80 }} /> */}
                <View>
                    <View>
                        {(proposal.panelBrands as string[] | []).map((brand, index) => (
                            <Text key={index} style={{ fontFamily: 'Poppins', fontSize: 16 }}>
                                {brand}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.blueLine} />

            {/* Inverter & Phase */}
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={{ fontFamily: 'Poppins', color: "#1d4ed8", fontSize: 16, fontWeight: "bold" }}>Solar Inverter</Text>
                <Text style={{ fontFamily: 'Poppins', color: "#1d4ed8", fontSize: 16, fontWeight: "bold" }}>
                    Inverter Brands:
                </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>

                <View style={{ marginTop: 10 }}>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Inverter: {proposal.invertorSize}</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Phase: {proposal.invertorPhase}</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Phase NOS: {proposal.invertorquantitiy}</Text>
                </View>
                {/* <View style={{ backgroundColor: "#696969", width: 2, height: 85, marginLeft: 100 }} /> */}
                <View>
                    <View>
                        {(proposal.invertorBrands as string[] | []).map((brand, index) => (
                            <Text key={index} style={{ fontFamily: 'Poppins', fontSize: 16 }}>
                                {brand}
                            </Text>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.blueLine} />

            {/* Cable & Warranty Section */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 10 }}>
                {/* Cable */}
                <View style={{ flexDirection: "row" }}>
                    <View>
                        <Text style={{ fontFamily: 'Poppins', color: "#1d4ed8", fontSize: 16, fontWeight: "bold" }}>Cable</Text>
                        <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Cable brand: {proposal.cableBrands}</Text>
                        <Text style={{ fontFamily: 'Poppins', color: "#1d4ed8", fontSize: 16, fontWeight: "bold" }}>Battery</Text>
                        <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Battery Brand:
                            {proposal.batteryBrands ? proposal.batteryBrands : 'NA'}
                        </Text>
                        <View>
                            <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Battery Type: {proposal.batterytype}</Text>

                            {typeof proposal.batterytype === "string" &&
                                proposal.batterytype.toLowerCase() === "lead-acid" &&
                                proposal.leadAcidSubtype && (
                                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Battery Capacity: {proposal.leadAcidSubtype}</Text>
                                )}
                        </View>
                        <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Battery Warranty: {proposal.batterywarranty} year(s)</Text>
                        <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Battery NOS: {proposal.batteryquantity}</Text>

                    </View>
                    {/* <View style={{ backgroundColor: "#696969", width: 2, height: 85, marginLeft: 100 }} /> */}
                </View>

                {/* Warranty */}
                <View>
                    <Text style={{ fontFamily: 'Poppins', color: "#1d4ed8", fontSize: 16, fontWeight: "bold" }}>Warranty</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Panel Performance: {proposal.performancewarranty} Year(s)</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Panel Product Warranty: {proposal.warranty} Year(s)</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Inverter: {proposal.Invertorwarranty} Year(s)</Text>
                    <Text style={{ fontFamily: 'Poppins', fontSize: 16 }}>Balance of System: {proposal.systemwarranty} Year(s)</Text>
                </View>
            </View>
            <Image src={Bill} />
        </Page>

        <Page size="A4" style={styles.page2}>
            <View style={{ marginBottom: 2 }}>
                <Text style={{ fontFamily: 'Work Sans', fontSize: 16, fontWeight: "bold", marginBottom: 4 }}>Terms & Condition</Text>
                <Text style={{
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    marginTop: 10,
                    lineHeight: 1.2,
                    textAlign: "justify",
                }} >{proposal.termandcondition}</Text>
            </View>
            <View style={{ marginBottom: 2 }}>
                <Text style={{ fontFamily: 'Work Sans', fontSize: 12, fontWeight: "bold", color: "#2563eb" }}>Balance Of System</Text>
                <Text style={{
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    marginTop: 10,
                    lineHeight: 1.2,
                    textAlign: "justify"
                }}>{proposal.balanceOfSystem}</Text>
            </View>
            <View style={{ marginBottom: 2 }}>
                <Text style={{ fontFamily: 'Work Sans', fontSize: 12, fontWeight: "bold", color: "#2563eb" }}>Coustomer Scope:</Text>
                <Text style={{
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    marginTop: 10,
                    lineHeight: 1.2,
                    textAlign: "justify"
                }}>{proposal.customerScope}</Text>
            </View>

            <View>
                <Text style={{ fontFamily: 'Work Sans', fontSize: 12, fontWeight: "bold", color: "#2563eb" }}>Our Scope:</Text>
                <Text style={{
                    fontFamily: 'Poppins',
                    fontSize: 12,
                    marginTop: 10,
                    lineHeight: 1.2,
                    textAlign: "justify"
                }}>{proposal.ourScope}</Text>
            </View>
            <View style={{ marginTop: 2, }}>
                <Text style={{ fontFamily: 'Work Sans', fontSize: 12, fontWeight: "Bold" }}>SUNMAYO PRIVATE LIMITED</Text>
                <View style={styles.row}>
                    <Image src={phonecall} style={{ width: 12, height: 12, marginRight: 4 }} />
                    <Text style={{
                        fontSize: 12,
                        lineHeight: 1.2,
                        textAlign: "justify",
                    }}>+91 9643800850</Text>
                </View>
                <View style={styles.row}>
                    <Image src={worldwide} style={{ width: 12, height: 12, marginRight: 4 }} />
                    <Text style={{
                        fontSize: 12,
                        lineHeight: 1.2,
                        textAlign: "justify",
                    }}>www.sunmayo.com</Text>
                </View>
                <View style={styles.row}>
                    <Image src={communicate} style={{ width: 12, height: 12, marginRight: 4 }} />
                    <Text style={{
                        fontSize: 12,
                        lineHeight: 1.2,
                        textAlign: "justify",
                    }}>info@sunmayo.com</Text>
                </View>
            </View>
        </Page>
    </Document>
);
