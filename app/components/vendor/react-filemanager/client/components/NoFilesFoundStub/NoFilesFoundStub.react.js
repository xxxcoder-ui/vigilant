import React from 'react'
import './NoFilesFoundStub.less'
import { SVG } from '@opuscapita/react-svg'
import nothingToShowIcon from '@opuscapita/svg-icons/lib/add_to_photos.svg'

// TODO Add localization
export default () => (
  <div className="oc-fm--no-files-found-stub">
    <SVG className="oc-fm--no-files-found-stub__icon" svg={nothingToShowIcon} />
    <div className="oc-fm--no-files-found-stub__title">No files uploaded yet.</div>
    <div className="oc-fm--no-files-found-stub__sub-title">Drag and drop your first file here.</div>
    {/*
    <div className="oc-fm--no-files-found-stub__sub-title">
      Drop files here or use "New" button
    </div>
    */}
  </div>
)
