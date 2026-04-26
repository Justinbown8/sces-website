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
    <section id="transparency" className="py-24 bg-gradient-to-b from-gray-50 to-white border-t border-gray-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-heading font-bold text-gray-900 mb-6 tracking-tight">
              Financial Transparency & Accountability
            </h2>
            <div className="w-24 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 mx-auto mb-8 rounded-full" />
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              We believe in complete transparency with our donors and stakeholders. 
              Our commitment to accountability ensures that every contribution is used effectively 
              to transform children's lives. Access our latest reports and filings below.
            </p>
          </motion.div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {reports.map((report, index) => (
            <motion.div
              key={report.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex h-full"
            >
              <Card className="flex flex-col w-full group hover:shadow-2xl transition-all duration-500 border border-gray-100 shadow-sm overflow-hidden bg-white rounded-3xl p-0 relative">
                {/* Visual Accent */}
                <div className="absolute top-0 left-0 w-1.5 h-0 bg-gradient-to-b from-yellow-400 to-orange-500 group-hover:h-full transition-all duration-500 z-10" />
                
                <CardHeader className="p-8 pb-4">
                  <div className="flex justify-between items-center mb-6">
                    <div className={cn(
                      "p-4 rounded-2xl transition-all duration-500 group-hover:scale-110",
                      report.color
                    )}>
                      {React.cloneElement(report.icon as React.ReactElement, { className: "w-8 h-8" })}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
                      {report.category}
                    </span>
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 group-hover:text-primary-orange transition-colors duration-300">
                    {report.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="flex flex-col flex-grow px-8 pb-8 pt-0">
                  <CardDescription className="text-gray-600 text-sm leading-relaxed mb-8 flex-grow">
                    {report.description}
                  </CardDescription>
                  
                  <div className="flex flex-col gap-3 mt-auto">
                    <Button
                      variant="primary"
                      size="md"
                      gradient={true}
                      className="w-full font-bold shadow-md hover:shadow-xl transition-all active:scale-95"
                      asChild
                    >
                      <a href={report.file} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                        <FileText className="w-5 h-5 mr-2" />
                        View Report
                      </a>
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="md"
                      className="w-full font-bold border-2 border-gray-200 hover:border-primary-orange hover:text-primary-orange transition-all active:scale-95 group/btn"
                      asChild
                    >
                      <a href={report.file} download className="flex items-center justify-center">
                        <Download className="w-5 h-5 mr-2 group_hover/btn:animate-bounce" />
                        Download PDF
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Accountability Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 p-10 rounded-[2.5rem] bg-gradient-to-br from-blue-900 to-indigo-950 text-white text-center shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-400/10 rounded-full -mr-40 -mt-40 blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/10 rounded-full -ml-40 -mb-40 blur-[100px] group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="relative z-10">
            <div className="inline-flex p-4 rounded-2xl bg-white/10 backdrop-blur-md mb-6 border border-white/10">
              <Landmark className="w-10 h-10 text-primary-yellow" />
            </div>
            <h3 className="text-3xl font-heading font-bold mb-4 tracking-tight">Committed to Ethical Governance</h3>
            <p className="text-blue-100/90 text-lg max-w-3xl mx-auto leading-relaxed text-balance">
              Sunrise Children Educational Society is a registered non-profit organization. 
              We are committed to maintaining the highest standards of financial integrity. 
              Every donation is audited and utilized precisely according to our mission 
              to provide transformative education.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TransparencySection;
