import DOMPurify from 'dompurify';

export const RichTextElement = ({ content }: any) => {
    const cleanHtml = DOMPurify.sanitize(content); // Sanitize the HTML

    return (
        <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />
    );
};