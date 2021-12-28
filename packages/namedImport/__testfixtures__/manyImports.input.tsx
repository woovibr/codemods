import { Candidate, CandidateApplication, Company, ICompany, IUser } from '@repo/modules';
import * as XLSX from 'xlsx';

import moment from 'moment';

import { getContext } from '../../../../common/getContext';
import * as CandidateLoader from '../CandidateLoader';

import { DATA_EXPORT_STATUS, IDataExport } from '../../../dataExport/DataExportModel';

import { formatConditions } from '../../../dataExport/jobs/exportUtils';

import { handleDataExportJob, Param } from '../../../dataExport/DataExportUtils';
import { generateFileName } from '../../../dataExport/exportGenerateFileName';
import { uploadFile } from '../../../dataExport/uploadFile';
import { saveExport } from '../../../dataExport/saveExport';
import { useTranslation } from '../../../../i18n/useTranslation';
import { dataExportNotifyUser } from '../../../dataExport/dataExportNotifyUser';
import { buildXlsxFile } from '../../../dataExport/buildXlsxFile';
import { exportDateTime } from '../../../goals/goalGroup/export/goalGroupIndividualGoalsSheet';
import { exportBoolean } from '../../../dataExport/exportBoolean';
import { exportEnum } from '../../../dataExport/exportEnum';
import { unique } from '../../../../common/utils';