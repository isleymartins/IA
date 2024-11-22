import React, { useContext, useEffect, useState } from 'react';
import TableData from "../../Table";
import { fetchQualityMetrics } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { QualityMetrics } from "../../../model/model";

const QualityMetricsComponent: React.FC = () => {
  const authContext = useContext(AuthContext);
  const [metrics, setMetrics] = useState<QualityMetrics[]>([]);

  if (!authContext) {
    console.log("Deu ruim");
    return null;
  }

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
      {metrics.length > 0 && <TableData row={metrics} feature={formData.feature} title="Modelo" />}
    </>
  );
};

export default QualityMetricsComponent;
