import React from 'react';

type BatteryType = string;  // Adjust based on your actual BatteryType
type LeadAcidSubtype = string;  // Adjust based on your actual LeadAcidSubtype

interface Proposal {
  _id?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  clientAddress: string;
  customerType: string;
  projectsize: string;
  consumption: string;
  electricity: string;
  generation: string;
  Wattpeak: string;
  proposalWattpeak: string;
  warranty: string;
  Invertorwarranty: string;
  InvertorSize: string;
  performancewarranty: string;
  quantity: string;
  invertorquantitiy: string;
  invertortype: string;
  invertorPhase: string;
  batteryBrands: string;
  batterytype: BatteryType | '';
  leadAcidSubtype?: LeadAcidSubtype | '';
  cableBrands: string;
  proposalStructure: string;
  structureDes: string;
  systemwarranty: string;
  balanceOfSystem: string;
  ourScope: string;
  customerScope: string;
  stage1: string;
  stage2: string;
  stage3: string;
  stage4: string;
  services: string[];
  products: string[];
  employees: string[];
  tableImage?: string;
  graphimage?: string;
  [key: string]: string | string[] | undefined;
}

interface ProposalPreviewProps {
  proposal: Proposal;
}

const ProposalPreview: React.FC<ProposalPreviewProps> = ({ proposal }) => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold text-center mb-6">Proposal Preview</h2>

      <section className="mb-6">
        <h3 className="text-2xl font-medium text-gray-700 mb-3">Client Information</h3>
        <p><strong className="font-semibold">Name:</strong> {proposal.clientName}</p>
        <p><strong className="font-semibold">Phone:</strong> {proposal.clientPhone}</p>
        <p><strong className="font-semibold">Email:</strong> {proposal.clientEmail}</p>
        <p><strong className="font-semibold">Address:</strong> {proposal.clientAddress}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-medium text-gray-700 mb-3">Project Information</h3>
        <p><strong className="font-semibold">Customer Type:</strong> {proposal.customerType}</p>
        <p><strong className="font-semibold">Project Size:</strong> {proposal.projectsize}</p>
        <p><strong className="font-semibold">Electricity Consumption:</strong> {proposal.consumption}</p>
        <p><strong className="font-semibold">Electricity Generation:</strong> {proposal.generation}</p>
        <p><strong className="font-semibold">Watt Peak:</strong> {proposal.Wattpeak}</p>
        <p><strong className="font-semibold">Proposal Watt Peak:</strong> {proposal.proposalWattpeak}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-medium text-gray-700 mb-3">Warranty Information</h3>
        <p><strong className="font-semibold">System Warranty:</strong> {proposal.warranty}</p>
        <p><strong className="font-semibold">Inverter Warranty:</strong> {proposal.Invertorwarranty}</p>
        <p><strong className="font-semibold">Performance Warranty:</strong> {proposal.performancewarranty}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-medium text-gray-700 mb-3">Equipment</h3>
        <p><strong className="font-semibold">Inverter Type:</strong> {proposal.invertortype}</p>
        <p><strong className="font-semibold">Inverter Phase:</strong> {proposal.invertorPhase}</p>
        <p><strong className="font-semibold">Inverter Size:</strong> {proposal.InvertorSize}</p>
        <p><strong className="font-semibold">Battery Brand:</strong> {proposal.batteryBrands}</p>
        <p><strong className="font-semibold">Battery Type:</strong> {proposal.batterytype || 'Not specified'}</p>
        <p><strong className="font-semibold">Cable Brand:</strong> {proposal.cableBrands}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-medium text-gray-700 mb-3">Project Scope</h3>
        <p><strong className="font-semibold">Our Scope:</strong> {proposal.ourScope}</p>
        <p><strong className="font-semibold">Customer Scope:</strong> {proposal.customerScope}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-medium text-gray-700 mb-3">Stages</h3>
        <p><strong className="font-semibold">Stage 1:</strong> {proposal.stage1}</p>
        <p><strong className="font-semibold">Stage 2:</strong> {proposal.stage2}</p>
        <p><strong className="font-semibold">Stage 3:</strong> {proposal.stage3}</p>
        <p><strong className="font-semibold">Stage 4:</strong> {proposal.stage4}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-medium text-gray-700 mb-3">Services and Products</h3>
        <p><strong className="font-semibold">Services:</strong> {proposal.services.join(', ')}</p>
        <p><strong className="font-semibold">Products:</strong> {proposal.products.join(', ')}</p>
      </section>

      <section className="mb-6">
        <h3 className="text-2xl font-medium text-gray-700 mb-3">Employees</h3>
        <p><strong className="font-semibold">Employees:</strong> {proposal.employees.join(', ')}</p>
      </section>

      {proposal.tableImage && (
        <section className="mb-6">
          <h3 className="text-2xl font-medium text-gray-700 mb-3">Table Image</h3>
          <img src={proposal.tableImage} alt="Table Image" className="max-w-full rounded-lg shadow-md" />
        </section>
      )}

      {proposal.graphimage && (
        <section className="mb-6">
          <h3 className="text-2xl font-medium text-gray-700 mb-3">Graph Image</h3>
          <img src={proposal.graphimage} alt="Graph Image" className="max-w-full rounded-lg shadow-md" />
        </section>
      )}
    </div>
  );
};

export default ProposalPreview;
