'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, ShieldCheck, BarChart3, FileSignature, Landmark } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const reports = [
  {
    title: 'Annual Report 2024-25',
    description: 'Comprehensive overview of our activities, achievements, and impact during the academic year 2024-25.',
    file: '/Annual Report-2024-25-Sunrise Children Educational Society.pdf',
    icon: <BarChart3 className="w-8 h-8" />,
    category: 'Annual Reports',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    title: 'Audit Report 2025',
    description: 'Independent auditor\'s report on the financial statements for the year 2025.',
    file: '/AUDIT REPORT 2025 (2).pdf',
    icon: <ShieldCheck className="w-8 h-8" />,
    category: 'Financials',
    color: 'bg-green-100 text-green-600'
  },
  {
    title: 'ITR Filing 2025-26',
    description: 'Official Income Tax Return filing for the assessment year 2025-26.',
    file: '/ITR 2025-26.pdf',
    icon: <Landmark className="w-8 h-8" />,
    category: 'Tax Compliance',
    color: 'bg-orange-100 text-orange-600'
  },
  {
    title: 'Society Registration Final',
    description: 'Final registration documents and society bye-laws for SCES.',
    file: '/SUNRISE CHILDREN EDUCATIONAL SOCIETY FINAL.pdf',
    icon: <FileSignature className="w-8 h-8" />,
    category: 'Governance',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    title: 'Form 10B Compliance',
    description: 'Audit report under section 12A(b) of the Income-tax Act, 1961 for charitable institutions.',
    file: '/FORM10B.pdf',
    icon: <FileText className="w-8 h-8" />,
    category: 'Compliance',
    color: 'bg-amber-100 text-amber-600'
  },
  {
    title: 'Signed ITR Document',
    description: 'Digitally signed Income Tax Return confirmation document.',
    file: '/AAPAS2135JE20251_signed.pdf',
    icon: <FileSignature className="w-8 h-8" />,
    category: 'Tax Compliance',
    color: 'bg-red-100 text-red-600'
  }
];

export const TransparencySection: React.FC = () => {
  return (
    <section id="transparency" className="py-20 bg-gray-50 border-t border-gray-100">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-heading font-bold text-gray-900 mb-4">
              Financial Transparency & Accountability
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-yellow to-primary-orange mx-auto mb-6 rounded-full" />
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe in complete transparency with our donors and stakeholders. 
              Access our official reports, audit findings, and tax filings below.
            </p>
          </motion.div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reports.map((report, index) => (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full group hover:shadow-2xl transition-all duration-300 border-none shadow-md overflow-hidden bg-white">
                <div className="absolute top-0 left-0 w-1 h-full gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${report.color} group-hover:scale-110 transition-transform duration-300`}>
                      {report.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                      {report.category}
                    </span>
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 mb-2">
                    {report.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex flex-col h-full">
                  <CardDescription className="text-gray-600 text-sm mb-6 flex-grow">
                    {report.description}
                  </CardDescription>
                  
                  <div className="flex items-center gap-3">
                    <Button
                      variant="primary"
                      size="sm"
                      gradient={true}
                      className="flex-1 font-semibold shadow-md group-hover:shadow-lg transition-all"
                      asChild
                    >
                      <a href={report.file} target="_blank" rel="noopener noreferrer">
                        <FileText className="w-4 h-4 mr-2" />
                        View Report
                      </a>
                    </Button>
                    <a
                      href={report.file}
                      download
                      className="p-2 text-gray-400 hover:text-primary-orange transition-colors duration-200"
                      title="Download PDF"
                    >
                      <Download className="w-5 h-5" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Accountability Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-16 p-8 rounded-2xl bg-gradient-to-br from-blue-900 to-blue-800 text-white text-center shadow-xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-32 -mb-32 blur-3xl" />
          
          <Landmark className="w-12 h-12 mx-auto mb-4 text-primary-yellow" />
          <h3 className="text-2xl font-bold mb-2">Committed to Ethical Governance</h3>
          <p className="text-blue-100 max-w-2xl mx-auto">
            Sunrise Children Educational Society is a registered non-profit organization. 
            Every donation is utilized according to our mission of providing quality education 
            to underserved children.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default TransparencySection;
