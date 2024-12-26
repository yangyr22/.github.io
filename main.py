def modify_obj_content(file_path):
    # 读取OBJ文件内容
    with open(file_path, 'r') as file:
        lines = file.readlines()

    modified_lines = []
    for line in lines:
        if line.strip().startswith('v '):
            parts = line.split()
            if len(parts) >= 4:
                # 修改三个数字
                parts[1] = str(float(parts[1]) * 3)
                parts[2] = str(float(parts[2]) * 3)
                parts[3] = str(float(parts[3]) * 3)
                new_line = ' '.join(parts) + '\n'
                modified_lines.append(new_line)
            else:
                # 如果行格式不正确，添加原始行
                modified_lines.append(line)
        else:
            # 如果行不以'v'开头，添加原始行
            modified_lines.append(line)

    # 将修改后的内容写回文件
    with open(file_path, 'w') as file:
        file.writelines(modified_lines)

# OBJ文件路径
file_path = 'room1/door1/models/8.obj'

# 修改OBJ内容并写回文件
modify_obj_content(file_path)