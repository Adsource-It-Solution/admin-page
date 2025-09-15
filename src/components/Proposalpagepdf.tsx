import { useState, useRef } from "react";

type Product = {
  id: number;
  name: string;
  qty: number;
  pricePerUnit: number;
  notes: string;
};

type Employee = {
  id: number;
  name: string;
  role: string;
};

type ProposalData = {
  preparedFor: { name: string; phone: string; address: string };
  preparedBy: { company: string; address: string; phone: string; mail: string };
  project: { title: string; location: string; capacity: string; inverter: string; structure: string };
  products: Product[];
  costs: {
    systemCost: number;
    structureCost: number;
    subtotal: number;
    gstPercent: number;
    gstAmount: number;
    totalCost: number;
    subsidy: number;
    netPayable: number;
    amountInWords: string;
  };
  paymentSchedule: { stage: string; percent: number }[];
  billOfMaterials: { inverterSize: string; phase: string };
  employees: Employee[];
};

export default function ProposalEditor() {
  const initial: ProposalData = {
    preparedFor: {
      name: "MR. NISHEETH PANDEY",
      phone: "+919971490782",
      address: "H.NO. 25, 2ND FLOOR BLOCK-E, ASHOK VIHAR, DELHI",
    },
    preparedBy: {
      company: "SUNMAYO PRIVATE LIMITED",
      address: "26/18 Laxmi Garden, Sector 11, Gurgaon, Haryana 122001",
      phone: "+919643800850",
      mail: "info@sunmayo.com",
    },
    project: {
      title: "5 KW Grid Tie Rooftop Solar System",
      location: "H.NO. 25, 2ND FLOOR BLOCK-E, ASHOK VIHAR, DELHI",
      capacity: "5 KW String Inverter",
      inverter: "5 KW",
      structure: "Elevated Plant",
    },
    products: [
      { id: 1, name: "550 Wp Premier Energies / Renew Power Panel", qty: 9, pricePerUnit: 59000 / 5, notes: "TopCon BiFacial" },
      { id: 2, name: "5 KW Inverter (Single Phase)", qty: 1, pricePerUnit: 0, notes: "Genus / Secure Net & Solar Meter" },
      { id: 3, name: "Structure & Mounting", qty: 1, pricePerUnit: 0, notes: "Galvanized" },
    ],
    costs: {
      systemCost: 295000,
      structureCost: 0,
      subtotal: 295000,
      gstPercent: 13.8,
      gstAmount: 40710,
      totalCost: 335710,
      subsidy: 88000,
      netPayable: 247710,
      amountInWords: "Two Lakh Forty Seven Thousand Seven Hundred Ten Rupees",
    },
    paymentSchedule: [
      { stage: "Advance (with PO)", percent: 30 },
      { stage: "Before Dispatch", percent: 65 },
      { stage: "After Installation", percent: 5 },
    ],
    billOfMaterials: {
      inverterSize: "10 kW",
      phase: "Single Phase",
    },
    employees: [{ id: 1, name: "Sanjay Kumar", role: "Site Engineer" }],
  };

  const [data, setData] = useState<ProposalData>(initial);
  const previewRef = useRef<HTMLDivElement | null>(null);

  function updatePreparedFor(field: keyof ProposalData["preparedFor"], value: string) {
    setData((d) => ({ ...d, preparedFor: { ...d.preparedFor, [field]: value } }));
  }

  function updatePreparedBy(field: keyof ProposalData["preparedBy"], value: string) {
    setData((d) => ({ ...d, preparedBy: { ...d.preparedBy, [field]: value } }));
  }

  function updateProject(field: keyof ProposalData["project"], value: string) {
    setData((d) => ({ ...d, project: { ...d.project, [field]: value } }));
  }

  function addProduct() {
    setData((d) => ({
      ...d,
      products: [...d.products, { id: Date.now(), name: "New Product", qty: 1, pricePerUnit: 0, notes: "" }],
    }));
  }

  function updateProduct(idx: number, field: keyof Product, value: string | number) {
    setData((d) => {
      const products = d.products.map((p, i) => (i === idx ? { ...p, [field]: value } : p));
      return { ...d, products };
    });
  }

  function removeProduct(idx: number) {
    setData((d) => ({ ...d, products: d.products.filter((_, i) => i !== idx) }));
  }

  function addEmployee() {
    setData((d) => ({ ...d, employees: [...d.employees, { id: Date.now(), name: "New Employee", role: "" }] }));
  }

  function updateEmployee(idx: number, field: keyof Employee, value: string) {
    setData((d) => ({ ...d, employees: d.employees.map((e, i) => (i === idx ? { ...e, [field]: value } : e)) }));
  }

  function removeEmployee(idx: number) {
    setData((d) => ({ ...d, employees: d.employees.filter((_, i) => i !== idx) }));
  }

  function recalcCosts() {
    const systemCost = Number(data.costs.systemCost) || 0;
    const structureCost = Number(data.costs.structureCost) || 0;
    const subtotal = systemCost + structureCost;
    const gstAmount = Math.round((subtotal * Number(data.costs.gstPercent || 0)) / 100);
    const totalCost = subtotal + gstAmount;
    const netPayable = totalCost - Number(data.costs.subsidy || 0);
    setData((d) => ({ ...d, costs: { ...d.costs, systemCost, structureCost, subtotal, gstAmount, totalCost, netPayable, gstPercent: d.costs.gstPercent, subsidy: d.costs.subsidy, amountInWords: d.costs.amountInWords } }));
  }

  async function exportToPDF() {
    const html2canvas = (await import("html2canvas")).default;
    const jsPDF = (await import("jspdf")).jsPDF;
    if (!previewRef.current) return;
    const canvas = await html2canvas(previewRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ unit: "pt", format: "a4" });
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("proposal.pdf");
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-3">Proposal Editor</h2>

          <section className="mb-4">
            <h3 className="font-medium">Prepared For</h3>
            <input className="w-full p-2 border rounded mt-2" value={data.preparedFor.name} onChange={(e) => updatePreparedFor("name", e.target.value)} />
            <input className="w-full p-2 border rounded mt-2" value={data.preparedFor.phone} onChange={(e) => updatePreparedFor("phone", e.target.value)} />
            <textarea className="w-full p-2 border rounded mt-2" value={data.preparedFor.address} onChange={(e) => updatePreparedFor("address", e.target.value)} />
          </section>

          <section className="mb-4">
            <h3 className="font-medium">Prepared By</h3>
            <input className="w-full p-2 border rounded mt-2" value={data.preparedBy.company} onChange={(e) => updatePreparedBy("company", e.target.value)} />
            <input className="w-full p-2 border rounded mt-2" value={data.preparedBy.phone} onChange={(e) => updatePreparedBy("phone", e.target.value)} />
            <input className="w-full p-2 border rounded mt-2" value={data.preparedBy.mail} onChange={(e) => updatePreparedBy("mail", e.target.value)} />
            <input className="w-full p-2 border rounded mt-2" value={data.preparedBy.address} onChange={(e) => updatePreparedBy("address", e.target.value)} />
          </section>

          <section className="mb-4">
            <h3 className="font-medium">Project</h3>
            <input className="w-full p-2 border rounded mt-2" value={data.project.title} onChange={(e) => updateProject("title", e.target.value)} />
            <input className="w-full p-2 border rounded mt-2" value={data.project.location} onChange={(e) => updateProject("location", e.target.value)} />
            <div className="grid grid-cols-2 gap-2 mt-2">
              <input className="p-2 border rounded" value={data.project.capacity} onChange={(e) => updateProject("capacity", e.target.value)} />
              <input className="p-2 border rounded" value={data.project.inverter} onChange={(e) => updateProject("inverter", e.target.value)} />
            </div>
          </section>

          <section className="mb-4">
            <h3 className="font-medium">Products</h3>
            {data.products.map((p: Product, idx: number) => (
              <div key={p.id} className="border rounded p-2 mb-2">
                <input className="w-full p-1 border rounded" value={p.name} onChange={(e) => updateProduct(idx, "name", e.target.value)} />
                <div className="grid grid-cols-3 gap-2 mt-2">
                  <input className="p-1 border rounded" type="number" value={p.qty} onChange={(e) => updateProduct(idx, "qty", Number(e.target.value))} />
                  <input className="p-1 border rounded" type="number" value={p.pricePerUnit} onChange={(e) => updateProduct(idx, "pricePerUnit", Number(e.target.value))} />
                  <input className="p-1 border rounded" value={p.notes} onChange={(e) => updateProduct(idx, "notes", e.target.value)} />
                </div>
                <div className="flex gap-2 justify-end mt-2">
                  <button className="text-sm px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeProduct(idx)}>Remove</button>
                </div>
              </div>
            ))}
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={addProduct}>Add Product</button>
            </div>
          </section>

          <section className="mb-4">
            <h3 className="font-medium">Employees</h3>
            {data.employees.map((e: Employee, idx: number) => (
              <div key={e.id} className="border rounded p-2 mb-2">
                <input className="w-full p-1 border rounded" value={e.name} onChange={(ev) => updateEmployee(idx, "name", ev.target.value)} />
                <input className="w-full p-1 border rounded mt-2" value={e.role} onChange={(ev) => updateEmployee(idx, "role", ev.target.value)} />
                <div className="flex gap-2 justify-end mt-2">
                  <button className="text-sm px-2 py-1 bg-red-500 text-white rounded" onClick={() => removeEmployee(idx)}>Remove</button>
                </div>
              </div>
            ))}
            <button className="px-3 py-1 bg-green-600 text-white rounded" onClick={addEmployee}>Add Employee</button>
          </section>

          <section className="mb-4">
            <h3 className="font-medium">Costs & Payment</h3>
            <div className="grid grid-cols-2 gap-2">
              <input className="p-2 border rounded" type="number" value={data.costs.systemCost} onChange={(e) => setData((d) => ({ ...d, costs: { ...d.costs, systemCost: Number(e.target.value) } }))} />
              <input className="p-2 border rounded" type="number" value={data.costs.structureCost} onChange={(e) => setData((d) => ({ ...d, costs: { ...d.costs, structureCost: Number(e.target.value) } }))} />
              <input className="p-2 border rounded" type="number" value={data.costs.gstPercent} onChange={(e) => setData((d) => ({ ...d, costs: { ...d.costs, gstPercent: Number(e.target.value) } }))} />
              <input className="p-2 border rounded" type="number" value={data.costs.subsidy} onChange={(e) => setData((d) => ({ ...d, costs: { ...d.costs, subsidy: Number(e.target.value) } }))} />
            </div>
            <div className="flex gap-2 mt-2">
              <button className="px-3 py-1 bg-blue-600 text-white rounded" onClick={recalcCosts}>Recalculate</button>
              <button className="px-3 py-1 bg-indigo-600 text-white rounded" onClick={exportToPDF}>Export Preview to PDF</button>
            </div>
          </section>
        </div>

        {/* Preview */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <div className="text-right text-sm">
              <div>{data.preparedBy.company}</div>
              <div>{data.preparedBy.address}</div>
              <div>{data.preparedBy.phone} | {data.preparedBy.mail}</div>
            </div>
          </div>

          <div ref={previewRef} className="p-4 border rounded bg-white text-gray-800">
            <header className="mb-4">
              <h1 className="text-2xl font-bold">New Template 35 - Proposal</h1>
              <div className="mt-2">Prepared For: <strong>{data.preparedFor.name}</strong></div>
              <div>{data.preparedFor.phone}</div>
              <div className="mb-2">{data.preparedFor.address}</div>
            </header>

            <section className="mb-4">
              <h3 className="font-semibold">Project</h3>
              <div>{data.project.title} — {data.project.location}</div>
              <div>Capacity: {data.project.capacity} | Inverter: {data.project.inverter}</div>
            </section>
            <section className="mb-4">
              <h3 className="font-semibold">Bill of Materials</h3>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th className="text-left border-b py-1">Description</th>
                    <th className="text-right border-b py-1">Qty</th>
                    <th className="text-right border-b py-1">Price/Unit</th>
                    <th className="text-right border-b py-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((p) => (
                    <tr key={p.id}>
                      <td className="py-1">{p.name}</td>
                      <td className="py-1 text-right">{p.qty}</td>
                      <td className="py-1 text-right">{Number(p.pricePerUnit).toLocaleString()}</td>
                      <td className="py-1 text-right">{(Number(p.qty) * Number(p.pricePerUnit)).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="mb-4 text-sm">
              <div className="flex justify-end">
                <div className="w-1/2">
                  <div className="flex justify-between py-1"><span>Subtotal</span><span>₹{(data.costs.subtotal || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between py-1"><span>GST ({data.costs.gstPercent}%)</span><span>₹{(data.costs.gstAmount || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between font-semibold py-1"><span>Total</span><span>₹{(data.costs.totalCost || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between py-1"><span>Subsidy</span><span>- ₹{(data.costs.subsidy || 0).toLocaleString()}</span></div>
                  <div className="flex justify-between font-bold py-1"><span>Net Payable</span><span>₹{(data.costs.netPayable || 0).toLocaleString()}</span></div>
                  <div className="mt-2">Amount in words: {data.costs.amountInWords}</div>
                </div>
              </div>
            </section>

            <section className="mb-4">
              <h3 className="font-semibold">Payment Schedule</h3>
              <ul className="list-disc ml-6">
                {data.paymentSchedule.map((p, i) => (
                  <li key={i}>{p.stage} — {p.percent}%</li>
                ))}
              </ul>
            </section>

            <section className="mb-4">
              <h3 className="font-semibold">Employees</h3>
              <ul className="ml-6 list-disc">
                {data.employees.map((e) => (
                  <li key={e.id}>{e.name} — {e.role}</li>
                ))}
              </ul>
            </section>

            <footer className="text-xs mt-6">
              <div>Bank Details: IDFC FIRST BANK — ACCOUNT NAME: SUNMAYO PRIVATE LIMITED — ACCOUNT NO: 10223162147 — IFSC: IDFB0021005</div>
              <div className="mt-2">Address: {data.preparedBy.address} | Contact: {data.preparedBy.phone} | Mail: {data.preparedBy.mail}</div>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
