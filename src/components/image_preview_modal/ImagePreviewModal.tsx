import { useTranslation } from 'react-i18next';
import { IMAGE_MODAL_ID } from './constants';
import { ImagePreviewModalProps } from './types';

/**
 * Image modal component.
 *
 * @param props  The image modal props.
 * @returns The image modal component.
 */
const ImagePreviewModal = ({ image }: ImagePreviewModalProps) => {
  const { t } = useTranslation();
  return (
    <div className="z-50 ">
      <input type="checkbox" id={IMAGE_MODAL_ID} className="modal-toggle" />
      <div className="modal overflow-scroll" role="dialog">
        <div className=" px-2 bg-base-200 rounded-lg w-[70%] h-[90%]">
          <div className="modal-action">
            <label
              htmlFor={IMAGE_MODAL_ID}
              className="btn btn-outline btn-error btn-circle btn-sm"
            >
              {t('ImageModalCloseCross')}
            </label>
          </div>
          <img
            src={image}
            alt="preview"
            loading="lazy"
            className=" rounded-xl object-cover w-full h-[90%]"
          ></img>
        </div>
      </div>
    </div>
  );
};

export default ImagePreviewModal;
