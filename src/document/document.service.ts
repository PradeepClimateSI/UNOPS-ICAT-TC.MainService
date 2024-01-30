import { statticFileLocation } from './entity/file-upload.utils';
import { DocumentOwner } from './entity/document-owner.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import {  Injectable,} from '@nestjs/common';
import { Documents } from './entity/document.entity';
import { join } from 'path';
import { DocOwnerUpdateDto } from './entity/doc-owner-update.dto';
var fs = require('fs');
var path = require('path');

@Injectable()
export class DocumentService extends TypeOrmCrudService<Documents> {
  
  constructor(
    @InjectRepository(Documents) repo,
  ) {
    super(repo);
  }

  saveDocument(doc: Documents) {
    return this.repo.save(doc).catch((error) => {
    });
  }

  deleteDocument(docId: number) {
    let doc = this.getDocument(docId).then((val) => {
      return this.repo
        .delete(val)
        .then((res) => {
          this.deleteFile(val.relativePath);
        })
        .catch((error) => {
        });
    });
  }

  deleteFile(filepath: string) {
    let rootPath = path.resolve('./');
    let fullfilePath = join(rootPath, statticFileLocation, filepath);
    if (fs.existsSync(fullfilePath)) {
      fs.unlinkSync(fullfilePath);
    }
  }

  getDocument(id: number): Promise<Documents> {
    return this.repo.findOne({ where: { id: id } });
  }

  async getDocuments(oid: number, owner: DocumentOwner): Promise<Documents[]> {
    let documenst = await this.repo.find({
      where: { documentOwnerId: oid, documentOwner: owner },
    });
    const base = process.env.ClientURl;
    documenst.forEach((a) => {
      a.url = `${base}/document/downloadDocument/attachment/${a.id}`;
    });

    return documenst;

  }

 async  updateDocOwner(req: DocOwnerUpdateDto):Promise<any> {
  let projectid=req.projectID
    for (let num of req.ids) {
      let update = await this.repo.createQueryBuilder()
      .update(Documents)
      .set({documentOwnerId:projectid})
      .where("id = :id", { id: num })
      .execute();
    }
  }
}
