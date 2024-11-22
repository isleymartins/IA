import React, { useContext, useEffect, useState } from 'react';
import TableData from "../../Table";
import { fetchQualityMetrics } from "../../../service/axios";
import { AuthContext } from "../../../context/AuthContext";
import { QualityMetrics } from "../../../model/model";

const m = [
  {
    "QualityMetrics": "producer_accuracy",
    "m1": [
      1.0,
      0.75,
      1.0
    ],
    "m2": [
      1.0,
      1.0,
      1.0
    ]
  },
  {
    "QualityMetrics": "user_accuracy",
    "m1": [
      1.0,
      1.0,
      0.8
    ],
    "m2": [
      1.0,
      1.0,
      1.0
    ]
  },
  {
    "QualityMetrics": "global_accuracy",
    "m1": 0.9090909090909091,
    "m2": 1.0
  },
  {
    "QualityMetrics": "causal_accuracy",
    "m1": 0.33884297520661155,
    "m2": 0.33884297520661155
  },
  {
    "QualityMetrics": "kappa_coefficient",
    "m1": 0.8624999999999999,
    "m2": 1.0
  },
  {
    "QualityMetrics": "var_kappa_coefficient",
    "m1": 0.017187500000000005,
    "m2": 0.0
  },
  {
    "QualityMetrics": "var_kappa_coefficient_advanced",
    "m1": 0.011885693359374996,
    "m2": 0
  },
  {
    "QualityMetrics": "precision",
    "m1": 0.9166666666666666,
    "m2": 1.0
  },
  {
    "QualityMetrics": "recall",
    "m1": 0.9333333333333332,
    "m2": 1.0
  },
  {
    "QualityMetrics": "f_score_1/2",
    "m1": 0.9199522102747908,
    "m2": 1.0
  },
  {
    "QualityMetrics": "f_score_1",
    "m1": 0.9249249249249248,
    "m2": 1.0
  },
  {
    "QualityMetrics": "f_score_2",
    "m1": 0.929951690821256,
    "m2": 1.0
  }
]
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
      {m.length > 0 && <TableData row={m} feature={formData.feature} title="Modelo" />}
    </>
  );
};

export default QualityMetricsComponent;
