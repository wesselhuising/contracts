import Link from 'next/link';
import { redirect } from 'next/navigation';

import { ChevronLeft, Users2 } from 'lucide-react';

import { getRequiredServerComponentSession } from '@documenso/lib/next-auth/get-server-session';
import { getDocumentById } from '@documenso/lib/server-only/document/get-document-by-id';
import { getFieldsForDocument } from '@documenso/lib/server-only/field/get-fields-for-document';
import { getRecipientsForDocument } from '@documenso/lib/server-only/recipient/get-recipients-for-document';
import { getFile } from '@documenso/lib/universal/upload/get-file';
import { DocumentStatus as InternalDocumentStatus } from '@documenso/prisma/client';
import { LazyPDFViewer } from '@documenso/ui/primitives/lazy-pdf-viewer';

import { EditDocumentForm } from '~/app/(dashboard)/documents/[id]/edit-document';
import { StackAvatarsWithTooltip } from '~/components/(dashboard)/avatar/stack-avatars-with-tooltip';
import { DocumentStatus } from '~/components/formatter/document-status';

export type DocumentPageProps = {
  params: {
    id: string;
  };
};

export default async function DocumentPage({ params }: DocumentPageProps) {
  const { id } = params;

  const documentId = Number(id);

  if (!documentId || Number.isNaN(documentId)) {
    redirect('/documents');
  }

  const session = await getRequiredServerComponentSession();

  const document = await getDocumentById({
    id: documentId,
    userId: session.id,
  }).catch(() => null);

  if (!document || !document.documentData) {
    redirect('/documents');
  }

  const { documentData } = document;

  const documentDataUrl = await getFile(documentData)
    .then((buffer) => Buffer.from(buffer).toString('base64'))
    .then((data) => `data:application/pdf;base64,${data}`);

  const [recipients, fields] = await Promise.all([
    await getRecipientsForDocument({
      documentId,
      userId: session.id,
    }),
    await getFieldsForDocument({
      documentId,
      userId: session.id,
    }),
  ]);

  return (
    <div className="mx-auto -mt-4 w-full max-w-screen-xl px-4 md:px-8">
      <Link href="/documents" className="flex items-center text-[#7AC455] hover:opacity-80">
        <ChevronLeft className="mr-2 inline-block h-5 w-5" />
        Documents
      </Link>

      <h1
        className="mt-4 max-w-xs truncate text-2xl font-semibold md:text-3xl"
        title={document.title}
      >
        {document.title}
      </h1>

      <div className="mt-2.5 flex items-center gap-x-6">
        <DocumentStatus inheritColor status={document.status} className="text-muted-foreground" />

        {recipients.length > 0 && (
          <div className="text-muted-foreground flex items-center">
            <Users2 className="mr-2 h-5 w-5" />

            <StackAvatarsWithTooltip recipients={recipients} position="bottom">
              <span>{recipients.length} Recipient(s)</span>
            </StackAvatarsWithTooltip>
          </div>
        )}
      </div>

      {document.status !== InternalDocumentStatus.COMPLETED && (
        <EditDocumentForm
          className="mt-8"
          document={document}
          user={session}
          recipients={recipients}
          fields={fields}
          dataUrl={documentDataUrl}
        />
      )}

      {document.status === InternalDocumentStatus.COMPLETED && (
        <div className="mx-auto mt-12 max-w-2xl">
          <LazyPDFViewer document={documentDataUrl} />
        </div>
      )}
    </div>
  );
}
