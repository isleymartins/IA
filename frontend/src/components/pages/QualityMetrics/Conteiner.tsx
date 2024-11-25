import React, { useContext, useEffect, useState } from 'react';
import TableData from "../../Table";
import { fetchQualityMetrics } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { QualityMetrics } from "../../../model/model";
import { Typography } from '@mui/material';

const QualityMetricsComponent: React.FC = () => {
  const authContext = useContext(AuthContext)
  const [metrics, setMetrics] = useState<QualityMetrics>();

  const { formData } = authContext;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedMetrics = await fetchQualityMetrics("minimumdistanceclassifier", "bayesclassifier");
        if (fetchedMetrics) {
          setMetrics(fetchedMetrics);
        }
      } catch (error) {
        console.error("Erro ao buscar métricas de qualidade:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      {metrics && <TableData row={metrics.metrics} feature={formData.feature} title="Modelo" />}
      <Typography>
        {metrics?.hipotese
          ? typeof metrics.hipotese === 'object'
            ? JSON.stringify(metrics.hipotese) // Converte para string se for objeto
            : metrics.hipotese // Exibe diretamente se for texto ou número
          : "Hipótese não disponível"}
      </Typography>
    </>
  );
};

export default QualityMetricsComponent;
